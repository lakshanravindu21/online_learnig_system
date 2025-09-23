const prisma = require("../prismaClient");
const fs = require("fs");
const path = require("path");

// Remove old file helper
const removeFile = (filePath) => {
  try {
    if (filePath) {
      const absPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }
  } catch (err) {
    console.error("Error removing file:", err);
  }
};

// Add new course
const addCourse = async (req, res) => {
  try {
    const { title, description, price, categoryId, status, instructorId, enrolledCount } = req.body;

    // Check instructor exists
    const instructor = await prisma.user.findUnique({ where: { id: parseInt(instructorId) } });
    if (!instructor) return res.status(400).json({ error: "Instructor not found" });

    // Check category exists
    let category = null;
    if (categoryId) {
      category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
      if (!category) return res.status(400).json({ error: "Category not found" });
    }

    const thumbnailFile = req.files?.thumbnailUrl?.[0];
    const contentFile = req.files?.contentUrl?.[0];

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId: category ? category.id : null,
        status,
        instructorId: parseInt(instructorId),
        enrolledCount: enrolledCount ? parseInt(enrolledCount) : 0,
        thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
        contentUrl: contentFile
          ? contentFile.mimetype.startsWith("video")
            ? `/uploads/videos/${contentFile.filename}`
            : `/uploads/documents/${contentFile.filename}`
          : null,
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { instructor: true, category: true },
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, categoryId, status, instructorId, enrolledCount } = req.body;

    const oldCourse = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!oldCourse) return res.status(404).json({ error: "Course not found" });

    // Validate foreign keys
    const instructor = await prisma.user.findUnique({ where: { id: parseInt(instructorId) } });
    if (!instructor) return res.status(400).json({ error: "Instructor not found" });

    let category = null;
    if (categoryId) {
      category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
      if (!category) return res.status(400).json({ error: "Category not found" });
    }

    let thumbnailUrl = oldCourse.thumbnailUrl;
    let contentUrl = oldCourse.contentUrl;

    const thumbnailFile = req.files?.thumbnailUrl?.[0];
    const contentFile = req.files?.contentUrl?.[0];

    if (thumbnailFile) {
      if (thumbnailUrl) removeFile(thumbnailUrl);
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFile.filename}`;
    }

    if (contentFile) {
      if (contentUrl) removeFile(contentUrl);
      contentUrl = contentFile.mimetype.startsWith("video")
        ? `/uploads/videos/${contentFile.filename}`
        : `/uploads/documents/${contentFile.filename}`;
    }

    const updated = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId: category ? category.id : null,
        status,
        instructorId: parseInt(instructorId),
        enrolledCount: enrolledCount ? parseInt(enrolledCount) : 0,
        thumbnailUrl,
        contentUrl,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.thumbnailUrl) removeFile(course.thumbnailUrl);
    if (course.contentUrl) removeFile(course.contentUrl);

    await prisma.course.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCourse, getCourses, updateCourse, deleteCourse };
