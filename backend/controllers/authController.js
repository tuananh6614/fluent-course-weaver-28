
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken, getTokenExpiration } = require('../utils/jwtUtils');

// @desc    Register user
// @route   POST /api/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }
    
    // Check if email exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, 'user']
    );
    
    if (result.affectedRows === 1) {
      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Đăng ký tài khoản không thành công'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email và mật khẩu'
      });
    }
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }
    
    const user = users[0];
    
    // Check if user is blocked
    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    const expiresAt = getTokenExpiration(token);
    
    res.status(200).json({
      success: true,
      token,
      expiresAt, 
      user: {
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify token validity
// @route   GET /api/verify-token
// @access  Private
exports.verifyToken = async (req, res) => {
  try {
    // If middleware passed, token is valid
    res.status(200).json({
      success: true,
      message: 'Token hợp lệ',
      user: req.user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email'
      });
    }
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      // Return success anyway to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: 'Nếu email đã được đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'
      });
    }
    
    // In a real application, send email with reset token
    // For now, just return success message
    res.status(200).json({
      success: true,
      message: 'Nếu email đã được đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'
    });
  } catch (error) {
    next(error);
  }
};
