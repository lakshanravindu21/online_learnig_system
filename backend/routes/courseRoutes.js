const express = require("express");
const upload = require("../middleware/upload");
const { addCourse, getCourses, updateCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();

// Add new course (thumbnail + content + duration + lectures)
router.post("/", upload, addCourse);

// Get all courses
router.get("/", getCourses);

// Update course (optional new thumbnail/content + duration + lectures)
router.put("/:id", upload, updateCourse);

// Delete course
router.delete("/:id", deleteCourse);

module.exports = router;
