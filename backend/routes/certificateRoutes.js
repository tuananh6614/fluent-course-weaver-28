
const express = require('express');
const router = express.Router();
const { 
  generateCertificate,
  getCertificate,
  verifyCertificate
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

router.post('/generate/:courseId', protect, generateCertificate);
router.get('/:id', getCertificate);
router.get('/verify/:number', verifyCertificate);

module.exports = router;
