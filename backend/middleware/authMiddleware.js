const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isMongo, store } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026_modern_hospitality';

const protect = async (req, res, next) => {
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
      message: 'Not authorized to access this route. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isMongo()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      req.user = user;
    } else {
      const user = store.users.find((u) => String(u._id) === String(decoded.id));
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      const safeUser = { ...user };
      delete safeUser.password;
      req.user = safeUser;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'unauthorized'}' is not allowed to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
