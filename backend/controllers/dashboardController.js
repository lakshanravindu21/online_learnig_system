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

// ✅ GET /api/dashboard/activities
const getRecentActivities = async (req, res) => {
  try {
    let activities = [];

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

    // Sort activities by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
};

module.exports = { getDashboardStats, getRecentActivities };
