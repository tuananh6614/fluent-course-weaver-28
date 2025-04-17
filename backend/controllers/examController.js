
const db = require('../config/db');

// @desc    Get course exams
// @route   GET /api/courses/:courseId/exams
// @access  Private
exports.getCourseExams = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    
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
    
    // Check if user is enrolled
    const [enrollments] = await db.query(
      'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
      [req.user.id, courseId]
    );
    
    if (enrollments.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    // Get exams
    const [exams] = await db.query(
      'SELECT * FROM exams WHERE course_id = ?',
      [courseId]
    );
    
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
exports.getExam = async (req, res, next) => {
  try {
    const examId = req.params.id;
    
    // Get exam details
    const [exams] = await db.query(
      'SELECT * FROM exams WHERE id = ?',
      [examId]
    );
    
    if (exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài kiểm tra'
      });
    }
    
    const exam = exams[0];
    
    // Check if user is enrolled in the course
    if (req.user.role !== 'admin') {
      const [enrollments] = await db.query(
        'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
        [req.user.id, exam.course_id]
      );
      
      if (enrollments.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Bạn chưa đăng ký khóa học này'
        });
      }
    }
    
    // Get questions without correct answers
    const [questions] = await db.query(
      `SELECT 
        id, 
        question_text, 
        option_a, 
        option_b, 
        option_c, 
        option_d 
      FROM questions 
      WHERE chapter_id = ?`,
      [exam.chapter_id]
    );
    
    // Add questions to exam
    exam.questions = questions;
    
    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit exam answers
// @route   POST /api/exams/:id/submit
// @access  Private
exports.submitExam = async (req, res, next) => {
  try {
    const examId = req.params.id;
    const userId = req.user.id;
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp câu trả lời'
      });
    }
    
    // Get exam details
    const [exams] = await db.query(
      'SELECT * FROM exams WHERE id = ?',
      [examId]
    );
    
    if (exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài kiểm tra'
      });
    }
    
    const exam = exams[0];
    
    // Check if user is enrolled in the course
    const [enrollments] = await db.query(
      'SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?',
      [userId, exam.course_id]
    );
    
    if (enrollments.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    // Get all questions with correct answers
    const [questions] = await db.query(
      'SELECT * FROM questions WHERE chapter_id = ?',
      [exam.chapter_id]
    );
    
    // Calculate score
    let correctCount = 0;
    const questionMap = {};
    
    questions.forEach(question => {
      questionMap[question.id] = question.correct_answer;
    });
    
    answers.forEach(answer => {
      if (questionMap[answer.question_id] && 
          questionMap[answer.question_id].toUpperCase() === answer.selected_option.toUpperCase()) {
        correctCount++;
      }
    });
    
    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const passStatus = score >= 70 ? 'pass' : 'fail'; // Default passing score 70%
    
    // Check if user has previous attempts
    const [attempts] = await db.query(
      'SELECT * FROM user_exam WHERE user_id = ? AND exam_id = ?',
      [userId, examId]
    );
    
    let result;
    
    if (attempts.length > 0) {
      // Update existing record
      [result] = await db.query(
        'UPDATE user_exam SET score = ?, attempt_count = attempt_count + 1, status = ?, completed_at = NOW() WHERE user_id = ? AND exam_id = ?',
        [score, passStatus, userId, examId]
      );
    } else {
      // Create new record
      [result] = await db.query(
        'INSERT INTO user_exam (user_id, exam_id, score, attempt_count, status) VALUES (?, ?, ?, ?, ?)',
        [userId, examId, score, 1, passStatus]
      );
    }
    
    // Update enrollment progress if exam passed
    if (passStatus === 'pass') {
      await db.query(
        'UPDATE enrollment SET progress_percent = 100 WHERE user_id = ? AND course_id = ?',
        [userId, exam.course_id]
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Nộp bài kiểm tra thành công',
      data: {
        exam_id: examId,
        score,
        correct_count: correctCount,
        total_questions: totalQuestions,
        status: passStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new exam (admin only)
// @route   POST /api/courses/:courseId/exams
// @access  Private/Admin
exports.createExam = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { title, time_limit, chapter_id, questions } = req.body;
    
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
    
    // Check if chapter exists if provided
    if (chapter_id) {
      const [chapters] = await db.query(
        'SELECT * FROM chapters WHERE id = ?',
        [chapter_id]
      );
      
      if (chapters.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chương'
        });
      }
    }
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tiêu đề bài kiểm tra'
      });
    }
    
    // Create exam transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Create exam
      const [examResult] = await connection.query(
        'INSERT INTO exams (course_id, chapter_id, title, time_limit, total_questions) VALUES (?, ?, ?, ?, ?)',
        [
          courseId, 
          chapter_id || null, 
          title, 
          time_limit || 30, 
          questions?.length || 0
        ]
      );
      
      const examId = examResult.insertId;
      
      // Add questions if provided
      if (questions && Array.isArray(questions) && questions.length > 0) {
        for (const q of questions) {
          await connection.query(
            'INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              chapter_id,
              q.question_text,
              q.option_a,
              q.option_b,
              q.option_c,
              q.option_d,
              q.correct_answer
            ]
          );
        }
        
        // Update total questions
        await connection.query(
          'UPDATE exams SET total_questions = ? WHERE id = ?',
          [questions.length, examId]
        );
      }
      
      await connection.commit();
      
      res.status(201).json({
        success: true,
        message: 'Tạo bài kiểm tra thành công',
        data: {
          id: examId,
          course_id: courseId,
          chapter_id: chapter_id || null,
          title,
          time_limit: time_limit || 30,
          total_questions: questions?.length || 0
        }
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};
