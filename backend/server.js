const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("./generated/prisma");

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

// 🔹 Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
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

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return only necessary user info
    res.json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    // If not, create new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: null, // no password for Google login
          role: "student",
        },
      });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 /me route - validate JWT
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
