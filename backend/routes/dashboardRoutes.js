const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ================================
// GET /api/dashboard/stats
// ================================
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

// ================================
// GET /api/dashboard/activities
// ================================
router.get("/activities", async (req, res) => {
  try {
    const activities = [];

    // Latest 2 student registrations
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

    // Latest 2 published courses
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

    // Latest 1 enrollment
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

    // Sort all activities by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching recent activities" });
  }
});

module.exports = router;
