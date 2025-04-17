
const db = require('../config/db');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const [courses] = await db.query(
      'SELECT * FROM courses ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    
    // Get course details
    const [courses] = await db.query(
      'SELECT * FROM Courses WHERE course_id = ?',
      [courseId]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    const course = courses[0];
    
    // Get chapters for the course
    const [chapters] = await db.query(
      'SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order',
      [courseId]
    );
    
    // Add chapters to course
    course.chapters = chapters;
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course (admin only)
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tiêu đề khóa học'
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO Courses (title, description, thumbnail) VALUES (?, ?, ?)',
      [title, description || '', thumbnail || '']
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể tạo khóa học'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Tạo khóa học thành công',
      data: {
        course_id: result.insertId,
        title,
        description,
        thumbnail
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (admin only)
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, description, thumbnail } = req.body;
    
    // Check if course exists
    const [courses] = await db.query(
      'SELECT * FROM Courses WHERE course_id = ?',
      [courseId]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Update course
    const [result] = await db.query(
      'UPDATE Courses SET title = ?, description = ?, thumbnail = ? WHERE course_id = ?',
      [
        title || courses[0].title,
        description !== undefined ? description : courses[0].description,
        thumbnail || courses[0].thumbnail,
        courseId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật khóa học không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật khóa học thành công',
      data: {
        id: courseId,
        title: title || courses[0].title,
        description: description !== undefined ? description : courses[0].description,
        thumbnail: thumbnail || courses[0].thumbnail
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (admin only)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    
    // Check if course exists
    const [courses] = await db.query(
      'SELECT * FROM Courses WHERE course_id = ?',
      [courseId]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Delete course
    const [result] = await db.query(
      'DELETE FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Xóa khóa học không thành công'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa khóa học thành công'
    });
  } catch (error) {
    next(error);
  }
};
