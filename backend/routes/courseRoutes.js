
const express = require('express');
const router = express.Router();
const { 
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { 
  getCourseChapters,
  createChapter
} = require('../controllers/chapterController');
const {
  enrollCourse
} = require('../controllers/enrollmentController');
const {
  getCourseExams,
  createExam
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

// Chapter routes
router.get('/:courseId/chapters', getCourseChapters);
router.post('/:courseId/chapters', protect, authorize('admin'), createChapter);

// Enrollment routes
router.post('/:courseId/enroll', protect, enrollCourse);

// Exam routes
router.get('/:courseId/exams', protect, getCourseExams);
router.post('/:courseId/exams', protect, authorize('admin'), createExam);

module.exports = router;
