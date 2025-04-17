
const express = require('express');
const router = express.Router();
const { 
  getExam,
  submitExam
} = require('../controllers/examController');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, getExam);
router.post('/:id/submit', protect, submitExam);

module.exports = router;
