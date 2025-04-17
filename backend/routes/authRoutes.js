
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  verifyToken, 
  forgotPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', protect, verifyToken);
router.post('/forgot-password', forgotPassword);

module.exports = router;
