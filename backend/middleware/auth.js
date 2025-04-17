
const { verifyToken } = require('../utils/jwtUtils');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không có quyền truy cập, vui lòng đăng nhập' 
      });
    }
    
    try {
      // Use the verifyToken function from utils
      const decoded = verifyToken(token);
      
      const [rows] = await db.query(
        'SELECT id, email, full_name, role, status FROM users WHERE id = ?', 
        [decoded.id]
      );
      
      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Người dùng không tồn tại'
        });
      }
      
      // Check if user is blocked or inactive
      if (rows[0].status === 'banned' || rows[0].status === 'inactive') {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên'
        });
      }
      
      req.user = rows[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }
    next();
  };
};
