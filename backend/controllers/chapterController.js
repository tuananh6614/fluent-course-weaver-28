
const db = require('../config/db');

// @desc    Get all chapters for a course
// @route   GET /api/courses/:courseId/chapters
// @access  Public
exports.getCourseChapters = async (req, res, next) => {
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
    
    // Get chapters
    const [chapters] = await db.query(
      'SELECT * FROM chapters WHERE course_id = ? ORDER BY chapter_order',
      [courseId]
    );
    
    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chapter
// @route   GET /api/chapters/:id
// @access  Public
exports.getChapter = async (req, res, next) => {
  try {
    const chapterId = req.params.id;
    
    // Get chapter details
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
    
    const chapter = chapters[0];
    
    res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new chapter (admin only)
// @route   POST /api/courses/:courseId/chapters
// @access  Private/Admin
exports.createChapter = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { title, description, chapter_order } = req.body;
    
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
    
    if (!title || !chapter_order) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tiêu đề và thứ tự chương'
      });
    }
    
    // Create chapter
    const [result] = await db.query(
      'INSERT INTO Chapters (course_id, title, description, chapter_order) VALUES (?, ?, ?, ?)',
      [courseId, title, description || '', chapter_order]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể tạo chương'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Tạo chương thành công',
      data: {
        chapter_id: result.insertId,
        course_id: courseId,
        title,
        description,
        chapter_order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chapter (admin only)
// @route   PUT /api/chapters/:id
// @access  Private/Admin
exports.updateChapter = async (req, res, next) => {
  try {
    const chapterId = req.params.id;
    const { title, description, chapter_order } = req.body;
    
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
    
    // Update chapter
    const [result] = await db.query(
      'UPDATE chapters SET title = ?, description = ?, chapter_order = ? WHERE id = ?',
      [
        title || chapters[0].title,
        description !== undefined ? description : chapters[0].description,
        chapter_order || chapters[0].chapter_order,
        chapterId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật chương không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật chương thành công',
      data: {
        chapter_id: chapterId,
        course_id: chapters[0].course_id,
        title: title || chapters[0].title,
        description: description !== undefined ? description : chapters[0].description,
        chapter_order: chapter_order || chapters[0].chapter_order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chapter (admin only)
// @route   DELETE /api/chapters/:id
// @access  Private/Admin
exports.deleteChapter = async (req, res, next) => {
  try {
    const chapterId = req.params.id;
    
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
    
    // Delete chapter
    const [result] = await db.query(
      'DELETE FROM chapters WHERE id = ?',
      [chapterId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Xóa chương không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa chương thành công'
    });
  } catch (error) {
    next(error);
  }
};
