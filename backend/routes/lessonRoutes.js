
const express = require('express');
const router = express.Router();
const { 
  getLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:id', getLesson);
router.put('/:id', protect, authorize('admin'), updateLesson);
router.delete('/:id', protect, authorize('admin'), deleteLesson);

module.exports = router;
