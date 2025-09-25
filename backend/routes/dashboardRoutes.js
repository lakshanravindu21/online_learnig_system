const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient"); // adjust path if needed

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    // Total Students
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });

    // Total Instructors
    const totalInstructors = await prisma.user.count({ where: { role: "instructor" } });

    // Total Courses
    const totalCourses = await prisma.course.count();

    // Total Revenue = sum of (price * enrolledCount) for all courses
    const courses = await prisma.course.findMany({
      select: { price: true, enrolledCount: true },
    });

    const totalRevenue = courses.reduce((acc, course) => {
      return acc + (course.price || 0) * (course.enrolledCount || 0);
    }, 0);

    res.json({
      totalStudents,
      totalInstructors,
      totalCourses,
      totalRevenue, // dynamically calculated
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching stats" });
  }
});

module.exports = router;
