
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Generate certificate for completed course
// @route   POST /api/certificates/generate/:courseId
// @access  Private
exports.generateCertificate = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    
    // Check if enrolled and completed
    const [enrollments] = await db.query(
      'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    
    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    const enrollment = enrollments[0];
    
    // Check if course is completed (100% progress)
    if (enrollment.progress_percent < 100) {
      return res.status(400).json({
        success: false,
        message: 'Bạn chưa hoàn thành khóa học này'
      });
    }
    
    // We don't have Certificates table in the new database structure
    // Using the exam and user_exam tables to track completion
    const [certificates] = await db.query(`
      SELECT ue.* 
      FROM user_exam ue
      JOIN exams e ON ue.exam_id = e.id
      WHERE ue.user_id = ? AND e.course_id = ? AND ue.status = 'pass'
    `, [userId, courseId]);
    
    if (certificates.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Chứng chỉ đã được cấp trước đó',
        data: certificates[0]
      });
    }
    
    // Since we don't have a dedicated Certificates table in the updated schema,
    // we'll use the user_exam table to track certificates
    // First, get the final exam for this course
    const [exams] = await db.query(
      'SELECT * FROM exams WHERE course_id = ? ORDER BY id DESC LIMIT 1',
      [courseId]
    );
    
    if (exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài kiểm tra cuối khóa'
      });
    }
    
    const examId = exams[0].id;
    const certificateNumber = `EH-${uuidv4().substring(0, 8).toUpperCase()}-${new Date().getFullYear()}`;
    
    // Create a passing record in user_exam to serve as certificate
    const [result] = await db.query(
      'INSERT INTO user_exam (user_id, exam_id, score, status, certificate_number, completed_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, examId, 100, 'pass', certificateNumber]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể cấp chứng chỉ'
      });
    }
    
    // Get certificate details
    const [newCertificate] = await db.query(`
      SELECT ue.*, e.course_id, e.title as exam_title 
      FROM user_exam ue
      JOIN exams e ON ue.exam_id = e.id
      WHERE ue.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Chứng chỉ đã được cấp thành công',
      data: newCertificate[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate details
// @route   GET /api/certificates/:id
// @access  Public
exports.getCertificate = async (req, res, next) => {
  try {
    const certificateId = req.params.id;
    
    // Get certificate information from user_exam table
    const [certificates] = await db.query(`
      SELECT ue.*, u.full_name, c.title as course_title, e.title as exam_title
      FROM user_exam ue
      JOIN users u ON ue.user_id = u.id
      JOIN exams e ON ue.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE ue.id = ? AND ue.status = 'pass'
    `, [certificateId]);
    
    if (certificates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chứng chỉ'
      });
    }
    
    res.status(200).json({
      success: true,
      data: certificates[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate by certificate number
// @route   GET /api/certificates/verify/:number
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificateNumber = req.params.number;
    
    // Get certificate information from user_exam table using certificate number
    const [certificates] = await db.query(`
      SELECT ue.*, u.full_name, c.title as course_title, e.title as exam_title
      FROM user_exam ue
      JOIN users u ON ue.user_id = u.id
      JOIN exams e ON ue.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE ue.certificate_number = ? AND ue.status = 'pass'
    `, [certificateNumber]);
    
    if (certificates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chứng chỉ không hợp lệ hoặc không tồn tại'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Chứng chỉ hợp lệ',
      data: certificates[0]
    });
  } catch (error) {
    next(error);
  }
};
