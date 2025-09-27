const express = require("express"); 
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("./generated/prisma");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Static serving for uploaded files (thumbnails, content, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer config for instructor profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/instructors");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Email transporter setup - FIXED: Changed createTransporter to createTransport
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email configuration
emailTransporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
  } else {
    console.log('Email server is ready to take messages');
  }
});

// Generate HTML email template
const generateWelcomeEmailHTML = (name, email, password, loginUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Learning Platform</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
            .credentials-box { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .login-button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Welcome to Our Learning Platform!</h1>
            <p>Your instructor account has been successfully created</p>
        </div>
        
        <div class="content">
            <h2>Hello ${name},</h2>
            
            <p>Congratulations! You have been added as an instructor to our learning platform. You now have access to manage your assigned courses and help students achieve their learning goals.</p>
            
            <div class="credentials-box">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
            </div>
            
            <div class="warning">
                <strong>Important Security Notice:</strong><br>
                Please change your password immediately after your first login for security reasons.
            </div>
            
            <h3>What you can do as an Instructor:</h3>
            <ul>
                <li>Manage your assigned courses</li>
                <li>Upload course materials and videos</li>
                <li>Track student progress</li>
                <li>Interact with enrolled students</li>
                <li>Update your profile information</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${loginUrl}" class="login-button">Login to Dashboard</a>
            </div>
            
            <p><strong>Need Help?</strong><br>
            If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>The Admin Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>2024 Learning Platform. All rights reserved.</p>
        </div>
    </body>
    </html>
  `;
};

// Root
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if ((req.user.role || "").toUpperCase() !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};

// Register user (Sign Up)
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: firstName + " " + lastName,
        email,
        password: hashedPassword,
        role: role || "student",
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "User registered successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login (Sign In)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Google Login
app.post("/api/google-login", async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ error: "Email and name are required" });

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email, password: null, role: "student" },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Contact Us endpoint
app.post("/api/contact", authenticateToken, async (req, res) => {
  const { fullName, phoneNumber, message } = req.body;
  if (!fullName || !phoneNumber || !message) return res.status(400).json({ error: "All fields are required." });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true, name: true } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // FIXED: Changed createTransporter to createTransport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"${fullName}" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `New Contact Message from ${fullName}`,
      text: `Name: ${fullName}\nEmail: ${user.email}\nPhone: ${phoneNumber}\nMessage: ${message}`,
      replyTo: user.email,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// /me route
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Example admin route
app.get("/api/admin/dashboard", authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! This route is protected." });
});

// Dashboard stats route
app.get("/api/dashboard/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { OR: [{ role: "student" }, { role: "STUDENT" }, { role: "Student" }] } });
    const totalInstructors = await prisma.user.count({ where: { OR: [{ role: "instructor" }, { role: "INSTRUCTOR" }, { role: "Instructor" }] } });
    const totalCourses = await prisma.course.count();
    const courses = await prisma.course.findMany({ select: { price: true, enrolledCount: true } });
    const totalRevenue = courses.reduce((acc, course) => acc + (course.price || 0) * (course.enrolledCount || 0), 0);

    res.json({ totalStudents, totalInstructors, totalCourses, totalRevenue });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Dashboard activities route
app.get("/api/dashboard/activities", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const activities = [];

    const recentStudents = await prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 2,
    });
    recentStudents.forEach(student => {
      activities.push({
        activity: "New Student Registration",
        details: `${student.name} registered`,
        date: student.createdAt.toISOString().split("T")[0],
      });
    });

    const recentCourses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { instructor: true },
      take: 2,
    });
    recentCourses.forEach(course => {
      activities.push({
        activity: "Recently Published Course",
        details: `${course.instructor.name} published '${course.title}'`,
        date: course.createdAt.toISOString().split("T")[0],
      });
    });

    const latestEnrollment = await prisma.enrollment.findFirst({
      orderBy: { createdAt: "desc" },
      include: { user: true, course: true },
    });
    if (latestEnrollment) {
      activities.push({
        activity: "Latest Enrollment",
        details: `${latestEnrollment.user.name} enrolled in '${latestEnrollment.course.title}'`,
        date: latestEnrollment.createdAt.toISOString().split("T")[0],
      });
    }

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(activities);
  } catch (err) {
    console.error("Error fetching recent activities:", err);
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
});

// Student Management API
app.post("/api/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, contact, status } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });
    const student = await prisma.user.create({ data: { name, email, contact, status, role: "student", password: null } });
    res.status(201).json(student);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
});

app.get("/api/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const students = await prisma.user.findMany({ where: { role: "student" }, orderBy: { createdAt: "desc" } });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Public Instructors Route (No Authentication Required)
app.get("/api/instructors/public", async (req, res) => {
  try {
    const instructors = await prisma.user.findMany({
      where: { 
        role: "instructor",
        status: "Active"
      },
      select: {
        id: true,
        name: true,
        email: true,
        rating: true,
        status: true,
        profileImage: true,
        contact: true,
        createdAt: true,
        courses: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const data = instructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      rating: inst.rating || 0,
      status: inst.status,
      profileImage: inst.profileImage || null,
      contact: inst.contact,
      createdAt: inst.createdAt,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching public instructors:", err);
    res.status(500).json({ message: "Failed to fetch instructors" });
  }
});

// Instructor Management API with email functionality (EXISTING ROUTES - UNCHANGED)
app.post("/api/instructors", authenticateToken, requireAdmin, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, contact, status, rating } = req.body;
    
    // Enhanced validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists. Please use a different email address." });
    }

    // Generate secure random password
    const randomPassword = crypto.randomBytes(8).toString('hex'); // 16-char password
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    // Create instructor
    const instructor = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        contact: contact?.trim() || null,
        status: status || "Active",
        role: "instructor",
        rating: rating !== undefined ? parseFloat(rating) : 0,
        password: hashedPassword, // Store hashed password
        profileImage: req.file ? `/uploads/instructors/${req.file.filename}` : null,
      },
    });

    // Send welcome email
    try {
      const loginUrl = 'http://localhost:3000/login'; // Update this to your frontend URL
      
      const emailHTML = generateWelcomeEmailHTML(name, email, randomPassword, loginUrl);

      const emailText = `
Hello ${name},

Welcome to our Learning Platform! Your instructor account has been successfully created.

LOGIN CREDENTIALS:
Email: ${email}
Password: ${randomPassword}

Login here: ${loginUrl}

IMPORTANT: Please change your password after your first login for security.

As an instructor, you can:
- Manage your assigned courses
- Upload course materials
- Track student progress
- Update your profile

Need help? Contact our support team.

Best regards,
The Admin Team
      `;

      console.log('Attempting to send welcome email to:', email);

      const emailResult = await emailTransporter.sendMail({
        from: `"Learning Platform Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome! Your Instructor Account is Ready',
        text: emailText,
        html: emailHTML,
      });

      console.log('Welcome email sent successfully to:', email);
      console.log('Message ID:', emailResult.messageId);
      
      res.status(201).json({ 
        message: `Instructor added successfully! Welcome email with login credentials sent to ${email}`,
        instructor: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          status: instructor.status,
          contact: instructor.contact,
          rating: instructor.rating,
          profileImage: instructor.profileImage,
          emailSent: true,
          messageId: emailResult.messageId
        }
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      console.error('Email error details:', {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode
      });
      
      // Still return success but mention email issue
      res.status(201).json({ 
        message: 'Instructor added successfully, but email could not be sent. Please provide login credentials manually.',
        instructor: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          status: instructor.status,
          contact: instructor.contact,
          rating: instructor.rating,
          profileImage: instructor.profileImage,
          emailSent: false,
          temporaryPassword: randomPassword, // Include password in response if email failed
          emailError: emailError.message
        }
      });
    }
  } catch (error) {
    console.error("Error adding instructor:", error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email address already exists' });
    }
    
    res.status(500).json({ error: "Failed to add instructor. Please try again." });
  }
});

app.get("/api/instructors", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let where = { role: "instructor" };
    if (status && status !== "All") where.status = status;
    if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }];

    const instructors = await prisma.user.findMany({ where, include: { courses: true }, orderBy: { createdAt: "desc" } });
    const data = instructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      rating: inst.rating || 0,
      status: inst.status,
      contact: inst.contact,
      profileImage: inst.profileImage || null,
      createdAt: inst.createdAt,
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
});

app.get("/api/instructors/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const instructor = await prisma.user.findUnique({ 
      where: { id: Number(id) }, 
      include: { 
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
            students: true // Get student count
          }
        }
      } 
    });
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (instructor.role !== 'instructor') {
      return res.status(400).json({ message: 'User is not an instructor' });
    }

    // Calculate total students across all courses
    const totalStudents = instructor.courses.reduce((total, course) => {
      return total + (course.students ? course.students.length : 0);
    }, 0);

    res.json({
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      totalCourses: instructor.courses.length,
      totalStudents: totalStudents,
      rating: instructor.rating || 0,
      status: instructor.status,
      contact: instructor.contact,
      profileImage: instructor.profileImage || null,
      courses: instructor.courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        studentCount: course.students ? course.students.length : 0
      })),
      createdAt: instructor.createdAt,
    });
  } catch (err) {
    console.error('Error fetching instructor:', err);
    res.status(500).json({ message: 'Failed to fetch instructor details' });
  }
});

app.put("/api/instructors/:id", authenticateToken, requireAdmin, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, contact, status, rating } = req.body;
    const updateData = {
      name,
      email,
      contact,
      status,
      rating: rating !== undefined ? parseFloat(rating) : 0,
    };
    if (req.file) updateData.profileImage = `/uploads/instructors/${req.file.filename}`;

    const instructor = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: updateData,
    });

    res.json(instructor);
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ error: "Failed to update instructor" });
  }
});

app.delete("/api/instructors/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Instructor deleted" });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    res.status(500).json({ error: "Failed to delete instructor" });
  }
});

// Test email endpoint (you can remove this after testing)
app.post("/api/test-email", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testResult = await emailTransporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from Learning Platform',
      text: 'This is a test email to verify email configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify email configuration.</p>'
    });

    res.json({ 
      success: true, 
      messageId: testResult.messageId,
      message: 'Test email sent successfully!' 
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code 
    });
  }
});

// Mount courseRoutes (public for testing)
const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));