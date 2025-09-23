const express = require("express");
const upload = require("../middleware/upload");
const { addCourse, getCourses, updateCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();

// Add new course (thumbnail + content)
router.post("/", upload, addCourse);

// Get all courses
router.get("/", getCourses);

// Update course (optional new thumbnail/content)
router.put("/:id", upload, updateCourse);

// Delete course
router.delete("/:id", deleteCourse);

module.exports = router;
