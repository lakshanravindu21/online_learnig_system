import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ➕ Add new student
export const addStudent = async (req, res) => {
  try {
    const { name, email, contact, course, status } = req.body;

    const student = await prisma.user.create({
      data: {
        name,
        email,
        contact,
        role: "STUDENT",
        password: null,
        status: status || "Active",
      },
    });

    if (course) {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: Number(course),
        },
      });
    }

    const studentWithCourses = await prisma.user.findUnique({
      where: { id: student.id },
      include: { enrollments: { include: { course: true } } },
    });

    const formatted = {
      ...studentWithCourses,
      enrolledCourses: studentWithCourses.enrollments?.map(e => e.course.title).join(", ") || "",
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
};

// 📜 Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { enrollments: { include: { course: true } } },
      orderBy: { createdAt: "desc" },
    });

    const formatted = students.map(s => ({
      ...s,
      enrolledCourses: s.enrollments?.map(e => e.course.title).join(", ") || "",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// 👀 Get single student
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { enrollments: { include: { course: true } } },
    });

    if (!student) return res.status(404).json({ error: "Student not found" });

    const formatted = {
      ...student,
      enrolledCourses: student.enrollments?.map(e => e.course.title).join(", ") || "",
    };

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ✏️ Update student (with course management)
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, status, courses } = req.body;

    // Update basic student info
    const student = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        contact,
        status: status || "Active",
      },
    });

    // Manage courses if provided
    if (courses) {
      // Delete existing enrollments
      await prisma.enrollment.deleteMany({ where: { userId: student.id } });

      // Add new enrollments
      const enrollmentData = courses.map(courseId => ({
        userId: student.id,
        courseId: Number(courseId),
      }));

      if (enrollmentData.length > 0) {
        await prisma.enrollment.createMany({ data: enrollmentData });
      }
    }

    // Fetch updated student with enrollments
    const updatedStudent = await prisma.user.findUnique({
      where: { id: student.id },
      include: { enrollments: { include: { course: true } } },
    });

    const formatted = {
      ...updatedStudent,
      enrolledCourses: updatedStudent.enrollments?.map(e => e.course.title).join(", ") || "",
    };

    // ✅ Send formatted updated student back to frontend
    res.json(formatted);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// ❌ Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Student deleted" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};
