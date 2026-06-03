const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { jwtAccessSecret } = require('../config/env');
const { ADMIN } = require('../constants/roles');

function getToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7);
}

const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtAccessSecret);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or inactive');
  }

  req.user = user;
  next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }
    return next();
  };
}

module.exports = { protect, authorize };
