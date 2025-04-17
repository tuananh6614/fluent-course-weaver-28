
const express = require('express');
const router = express.Router();
const { 
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const {
  getEnrollments,
  updateProgress
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/enrollments', protect, getEnrollments);
router.put('/enrollments/:courseId/progress', protect, updateProgress);

module.exports = router;
