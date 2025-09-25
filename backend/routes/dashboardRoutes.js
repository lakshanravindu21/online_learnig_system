import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Admin stats endpoint
router.get("/stats", async (req, res) => {
  try {
    const studentsCount = await prisma.user.count({ where: { role: "STUDENT" } });
    const instructorsCount = await prisma.user.count({ where: { role: "instructor" } });
    const coursesCount = await prisma.course.count();

    res.json({
      students: studentsCount,
      instructors: instructorsCount,
      courses: coursesCount,
      revenue: 50000, // 💡 Replace with real logic if you track payments
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
