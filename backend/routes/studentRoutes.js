import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// ✅ Middleware → only admins allowed
const isAdmin = (req, res, next) => {
  if ((req.user?.role || "").toUpperCase() !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// CRUD routes
router.post("/", isAdmin, addStudent);
router.get("/", isAdmin, getStudents);
router.get("/:id", isAdmin, getStudentById);
router.put("/:id", isAdmin, updateStudent);
router.delete("/:id", isAdmin, deleteStudent);

export default router;
