
const db = require('../config/db');

// @desc    Get all lessons for a chapter
// @route   GET /api/chapters/:chapterId/lessons
// @access  Public
exports.getChapterLessons = async (req, res, next) => {
  try {
    const chapterId = req.params.chapterId;
    
    // Check if chapter exists
    const [chapters] = await db.query(
      'SELECT * FROM chapters WHERE id = ?',
      [chapterId]
    );
    
    if (chapters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chương'
      });
    }
    
    // Get lessons
    const [lessons] = await db.query(
      'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY lesson_order',
      [chapterId]
    );
    
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
exports.getLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    
    // Get lesson details
    const [lessons] = await db.query(
      'SELECT * FROM Lessons WHERE lesson_id = ?',
      [lessonId]
    );
    
    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }
    
    const lesson = lessons[0];
    
    // Get pages for the lesson
    const [pages] = await db.query(
      'SELECT * FROM Pages WHERE lesson_id = ? ORDER BY page_number',
      [lessonId]
    );
    
    // Add pages to lesson
    lesson.pages = pages;
    
    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lesson (admin only)
// @route   POST /api/chapters/:chapterId/lessons
// @access  Private/Admin
exports.createLesson = async (req, res, next) => {
  try {
    const chapterId = req.params.chapterId;
    const { title, content, lesson_order } = req.body;
    
    // Check if chapter exists
    const [chapters] = await db.query(
      'SELECT * FROM Chapters WHERE chapter_id = ?',
      [chapterId]
    );
    
    if (chapters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chương'
      });
    }
    
    if (!title || !lesson_order) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tiêu đề và thứ tự bài học'
      });
    }
    
    // Create lesson
    const [result] = await db.query(
      'INSERT INTO lessons (chapter_id, title, content, lesson_order) VALUES (?, ?, ?, ?)',
      [chapterId, title, content || '', lesson_order]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể tạo bài học'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Tạo bài học thành công',
      data: {
        lesson_id: result.insertId,
        chapter_id: chapterId,
        title,
        content,
        lesson_order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson (admin only)
// @route   PUT /api/lessons/:id
// @access  Private/Admin
exports.updateLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const { title, content, lesson_order } = req.body;
    
    // Check if lesson exists
    const [lessons] = await db.query(
      'SELECT * FROM Lessons WHERE lesson_id = ?',
      [lessonId]
    );
    
    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }
    
    // Update lesson
    const [result] = await db.query(
      'UPDATE Lessons SET title = ?, content = ?, lesson_order = ? WHERE lesson_id = ?',
      [
        title || lessons[0].title,
        content !== undefined ? content : lessons[0].content,
        lesson_order || lessons[0].lesson_order,
        lessonId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật bài học không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật bài học thành công',
      data: {
        lesson_id: lessonId,
        chapter_id: lessons[0].chapter_id,
        title: title || lessons[0].title,
        content: content !== undefined ? content : lessons[0].content,
        lesson_order: lesson_order || lessons[0].lesson_order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson (admin only)
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
exports.deleteLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    
    // Check if lesson exists
    const [lessons] = await db.query(
      'SELECT * FROM Lessons WHERE lesson_id = ?',
      [lessonId]
    );
    
    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }
    
    // Delete lesson
    const [result] = await db.query(
      'DELETE FROM lessons WHERE id = ?',
      [lessonId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Xóa bài học không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa bài học thành công'
    });
  } catch (error) {
    next(error);
  }
};
