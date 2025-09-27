const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getInstructors,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructor,
  getInstructorCourses
} = require('../controllers/instructorController');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enhanced Multer setup with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `instructor-${uniqueSuffix}${extension}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  
  next(err);
};

// Routes with enhanced error handling
router.get('/', getInstructors);
router.get('/:id', getInstructor);
router.get('/:id/courses', getInstructorCourses);

// POST route with file upload and error handling
router.post('/', upload.single('profileImage'), handleMulterError, addInstructor);

// PUT route with file upload and error handling  
router.put('/:id', upload.single('profileImage'), handleMulterError, updateInstructor);

router.delete('/:id', deleteInstructor);

module.exports = router;
