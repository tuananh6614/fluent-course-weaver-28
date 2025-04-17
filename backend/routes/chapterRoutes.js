
const express = require('express');
const router = express.Router();
const { 
  getChapter,
  updateChapter,
  deleteChapter
} = require('../controllers/chapterController');
const {
  getChapterLessons,
  createLesson
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/:id', getChapter);

// Protected routes
router.put('/:id', protect, authorize('admin'), updateChapter);
router.delete('/:id', protect, authorize('admin'), deleteChapter);

// Lesson routes
router.get('/:chapterId/lessons', getChapterLessons);
router.post('/:chapterId/lessons', protect, authorize('admin'), createLesson);

module.exports = router;
