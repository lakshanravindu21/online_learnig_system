const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("./generated/prisma");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// 🔹 Middleware to protect routes
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

// 🔹 Middleware to check admin role (fixed case sensitivity)
const requireAdmin = (req, res, next) => {
  if ((req.user.role || "").toUpperCase() !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};

// 🔹 Register user (Sign Up)
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

// 🔹 Login (Sign In)
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

// 🔹 Google Login
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

// 🔹 Contact Us endpoint
app.post("/api/contact", authenticateToken, async (req, res) => {
  const { fullName, phoneNumber, message } = req.body;
  if (!fullName || !phoneNumber || !message) return res.status(400).json({ error: "All fields are required." });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true, name: true } });
    if (!user) return res.status(404).json({ error: "User not found" });

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

// 🔹 /me route
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

// 🔹 Example admin route
app.get("/api/admin/dashboard", authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! This route is protected." });
});

// ==================================================
// 🔹 Student Management API (Admin Only)
// ==================================================

// ➕ Add new student
app.post("/api/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, contact, status } = req.body;
    const student = await prisma.user.create({ data: { name, email, contact, status, role: "student", password: null } });
    res.status(201).json(student);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
});

// 📜 Get all students
app.get("/api/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const students = await prisma.user.findMany({ where: { role: "student" }, orderBy: { createdAt: "desc" } });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// 👀 Get single student
app.get("/api/students/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const student = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// ✏️ Update student
app.put("/api/students/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, contact, status } = req.body;
    const student = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { name, email, contact, status } });
    res.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

// ❌ Delete student
app.delete("/api/students/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Student deleted" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// ==================================================
// 🔹 Instructor Management API (Admin Only)
// ==================================================

// ➕ Add new instructor
app.post("/api/instructors", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, contact, status, rating } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const instructor = await prisma.user.create({
      data: {
        name,
        email,
        contact,
        status: status || "Active",
        role: "instructor",
        rating: rating !== undefined ? parseFloat(rating) : 0, // ✅ convert to float
        password: null
      },
    });

    res.status(201).json(instructor);
  } catch (error) {
    console.error("Error adding instructor:", error);
    res.status(500).json({ error: "Failed to add instructor" });
  }
});

// 📜 Get all instructors
app.get("/api/instructors", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;

    let where = { role: "instructor" };
    if (status && status !== "All") where.status = status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const instructors = await prisma.user.findMany({
      where,
      include: { courses: true },
      orderBy: { id: "asc" },
    });

    const data = instructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      rating: inst.rating || 0,
      status: inst.status,
      contact: inst.contact,
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
});

// 👀 Get single instructor
app.get("/api/instructors/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const instructor = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { courses: true },
    });
    if (!instructor) return res.status(404).json({ error: "Instructor not found" });

    res.json({
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      totalCourses: instructor.courses.length,
      rating: instructor.rating || 0,
      status: instructor.status,
      contact: instructor.contact,
    });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res.status(500).json({ error: "Failed to fetch instructor" });
  }
});

// ✏️ Update instructor
app.put("/api/instructors/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, contact, status, rating } = req.body;
    const instructor = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        email,
        contact,
        status,
        rating: rating !== undefined ? parseFloat(rating) : 0, // ✅ convert to float
      },
    });
    res.json(instructor);
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ error: "Failed to update instructor" });
  }
});

// ❌ Delete instructor
app.delete("/api/instructors/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Instructor deleted" });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    res.status(500).json({ error: "Failed to delete instructor" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
