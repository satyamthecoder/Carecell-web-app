const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carecell_dev_secret_key');
    
    // Try to get user from DB, fallback for demo mode
    try {
      const User = require('../models/User');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
    } catch (dbErr) {
      // Demo mode - use decoded token data
      req.user = { id: decoded.id, name: decoded.name, role: decoded.role };
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this action`
      });
    }
    next();
  };
};

const generateToken = (id, name, role) => {
  return jwt.sign(
    { id, name, role },
    process.env.JWT_SECRET || 'carecell_dev_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = { protect, authorize, generateToken };
