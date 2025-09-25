const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    // Count total instructors
    const totalInstructors = await prisma.user.count({ where: { role: 'instructor' } });

    // Count total courses
    const totalCourses = await prisma.course.count();

    // Calculate total revenue dynamically (price * enrolledCount)
    const courses = await prisma.course.findMany({
      select: { price: true, enrolledCount: true },
    });

    const totalRevenue = courses.reduce((acc, course) => {
      return acc + (course.price || 0) * (course.enrolledCount || 0);
    }, 0);

    res.json({ totalStudents, totalInstructors, totalCourses, totalRevenue });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

module.exports = { getDashboardStats };
