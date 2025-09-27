const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Setup Nodemailer with correct Gmail configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Alternative configuration for Gmail (use this if above doesn't work)
// const transporter = nodemailer.createTransporter({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    console.log('SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Missing');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '✗ Missing');
  } else {
    console.log('✅ Email server is ready to take messages');
  }
});

// Get all instructors with enhanced filtering
const getInstructors = async (req, res) => {
  try {
    const { status, search } = req.query;
    let where = { role: 'instructor' };

    if (status && status !== 'All') where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
      ];
    }

    const instructors = await prisma.user.findMany({
      where,
      include: { courses: true },
      orderBy: { createdAt: 'desc' },
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
    console.error('Error fetching instructors:', err);
    res.status(500).json({ message: 'Failed to fetch instructors' });
  }
};

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
            <h1>🎓 Welcome to Our Learning Platform!</h1>
            <p>Your instructor account has been successfully created</p>
        </div>
        
        <div class="content">
            <h2>Hello ${name},</h2>
            
            <p>Congratulations! You have been added as an instructor to our learning platform. You now have access to manage your assigned courses and help students achieve their learning goals.</p>
            
            <div class="credentials-box">
                <h3>🔐 Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important Security Notice:</strong><br>
                Please change your password immediately after your first login for security reasons.
            </div>
            
            <h3>🎯 What you can do as an Instructor:</h3>
            <ul>
                <li>Manage your assigned courses</li>
                <li>Upload course materials and videos</li>
                <li>Track student progress</li>
                <li>Interact with enrolled students</li>
                <li>Update your profile information</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${loginUrl}" class="login-button">🚀 Login to Dashboard</a>
            </div>
            
            <p><strong>Need Help?</strong><br>
            If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>The Admin Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© 2024 Learning Platform. All rights reserved.</p>
        </div>
    </body>
    </html>
  `;
};

// Add a new instructor with enhanced email and validation
const addInstructor = async (req, res) => {
  try {
    const { name, email, status = 'Active', contact, rating, courseIds } = req.body;
    const file = req.file;

    // Enhanced validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email address.' });
    }

    // Generate secure random password
    const randomPassword = crypto.randomBytes(8).toString('hex'); // 16-char password
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    // Create instructor with transaction for data consistency
    const instructor = await prisma.$transaction(async (prisma) => {
      const newInstructor = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role: 'instructor',
          status,
          contact: contact?.trim() || null,
          rating: rating ? Math.max(0, Math.min(5, Number(rating))) : 0, // Ensure rating is between 0-5
          password: hashedPassword,
          profileImage: file ? `/uploads/${file.filename}` : null,
          courses: courseIds ? { connect: courseIds.map(id => ({ id: Number(id) })) } : undefined,
        },
        include: { courses: true },
      });

      return newInstructor;
    });

    // Send welcome email with enhanced template
    try {
      const loginUrl = `${process.env.FRONTEND_URL}/login` || 'http://localhost:3000/login';
      
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

---
This is an automated email. Please do not reply.
      `;

      console.log('🔄 Attempting to send welcome email to:', email);

      const emailResult = await transporter.sendMail({
        from: `"Learning Platform Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🎓 Welcome! Your Instructor Account is Ready',
        text: emailText,
        html: emailHTML,
      });

      console.log('✅ Welcome email sent successfully to:', email);
      console.log('📧 Message ID:', emailResult.messageId);
      
      res.status(201).json({ 
        message: `Instructor added successfully! Welcome email with login credentials sent to ${email}`,
        instructor: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          status: instructor.status,
          totalCourses: instructor.courses.length,
          emailSent: true,
          messageId: emailResult.messageId
        }
      });
    } catch (emailError) {
      console.error('❌ Error sending welcome email:', emailError);
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
          totalCourses: instructor.courses.length,
          emailSent: false,
          temporaryPassword: randomPassword, // Include password in response if email failed
          emailError: emailError.message
        }
      });
    }
  } catch (err) {
    console.error('Error adding instructor:', err);
    
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'Email address already exists' });
    }
    
    res.status(500).json({ message: 'Failed to add instructor. Please try again.' });
  }
};

// Update an instructor with enhanced validation
const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status = 'Active', contact, rating, courseIds } = req.body;
    const file = req.file;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if email exists for other instructors
    const existingWithEmail = await prisma.user.findFirst({ 
      where: { 
        email: email.toLowerCase().trim(),
        NOT: { id: Number(id) }
      } 
    });
    
    if (existingWithEmail) {
      return res.status(400).json({ message: 'Email already exists for another user' });
    }

    const instructor = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        status,
        contact: contact?.trim() || null,
        rating: rating ? Math.max(0, Math.min(5, Number(rating))) : 0,
        ...(file && { profileImage: `/uploads/${file.filename}` }),
        ...(courseIds && { courses: { set: courseIds.map(c => ({ id: Number(c) })) } }),
      },
      include: { courses: true },
    });

    res.json({
      message: 'Instructor updated successfully',
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: instructor.status,
        contact: instructor.contact,
        rating: instructor.rating,
        totalCourses: instructor.courses.length,
        profileImage: instructor.profileImage,
      }
    });
  } catch (err) {
    console.error('Error updating instructor:', err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    res.status(500).json({ message: 'Failed to update instructor' });
  }
};

// Delete instructor with enhanced error handling
const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if instructor exists and has courses
    const instructor = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { courses: true }
    });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (instructor.courses.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete instructor. They are assigned to ${instructor.courses.length} course(s). Please reassign their courses first.` 
      });
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    
    res.json({ 
      message: `Instructor "${instructor.name}" deleted successfully`,
      deletedInstructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email
      }
    });
  } catch (err) {
    console.error('Error deleting instructor:', err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    res.status(500).json({ message: 'Failed to delete instructor' });
  }
};

// Get single instructor with detailed information
const getInstructor = async (req, res) => {
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
};

// Get instructor's courses (additional endpoint)
const getInstructorCourses = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instructor = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        courses: {
          include: {
            students: true,
            _count: {
              select: { students: true }
            }
          }
        }
      }
    });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor.courses);
  } catch (err) {
    console.error('Error fetching instructor courses:', err);
    res.status(500).json({ message: 'Failed to fetch instructor courses' });
  }
};

module.exports = {
  getInstructors,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructor,
  getInstructorCourses,
};
