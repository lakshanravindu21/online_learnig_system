import express from 'express';
import {
  getInstructors,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructor
} from '../controllers/instructorController.js';

const router = express.Router();

// 🔹 CRUD routes
router.get('/', getInstructors);        // List all instructors
router.get('/:id', getInstructor);      // Get single instructor
router.post('/', addInstructor);        // Add new instructor
router.put('/:id', updateInstructor);   // Update instructor
router.delete('/:id', deleteInstructor);// Delete instructor

export default router;
