
const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '30d' } // 30 days expiration
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here'
    );
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
};

exports.getTokenExpiration = (token) => {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here'
    );
    return new Date(decoded.exp * 1000); // Convert to milliseconds
  } catch (error) {
    return null;
  }
};
