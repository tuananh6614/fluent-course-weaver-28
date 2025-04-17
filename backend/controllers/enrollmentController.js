
const db = require('../config/db');

// @desc    Enroll in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private
exports.enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    
    // Check if course exists
    const [courses] = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Check if already enrolled
    const [enrollments] = await db.query(
      'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    
    if (enrollments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký khóa học này'
      });
    }
    
    // Enroll in course
    const [result] = await db.query(
      'INSERT INTO Enrollments (user_id, course_id, progress_percent) VALUES (?, ?, ?)',
      [userId, courseId, 0]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Đăng ký khóa học không thành công'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký khóa học thành công',
      data: {
        enrollment_id: result.insertId,
        user_id: userId,
        course_id: courseId,
        progress_percent: 0,
        enrolled_date: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrolled courses for a user
// @route   GET /api/enrollments
// @access  Private
exports.getEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    
    // Get enrollments with course details
    const [enrollments] = await db.query(`
      SELECT e.*, c.title, c.description, c.thumbnail 
      FROM Enrollments e
      JOIN Courses c ON e.course_id = c.course_id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_date DESC
    `, [userId]);
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.user_id;
    const { progress_percent, current_lesson_id } = req.body;
    
    // Check if enrolled
    const [enrollments] = await db.query(
      'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    
    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    // Validate lesson if provided
    if (current_lesson_id) {
      const [lessons] = await db.query(
        'SELECT * FROM Lessons WHERE lesson_id = ?',
        [current_lesson_id]
      );
      
      if (lessons.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài học'
        });
      }
    }
    
    // Update progress
    const [result] = await db.query(
      'UPDATE enrollment SET progress_percent = ?, current_lesson_id = ? WHERE user_id = ? AND course_id = ?',
      [
        progress_percent || enrollments[0].progress_percent,
        current_lesson_id || enrollments[0].current_lesson_id,
        userId,
        courseId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật tiến độ không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật tiến độ thành công',
      data: {
        course_id: courseId,
        progress_percent: progress_percent || enrollments[0].progress_percent,
        current_lesson_id: current_lesson_id || enrollments[0].current_lesson_id
      }
    });
  } catch (error) {
    next(error);
  }
};
