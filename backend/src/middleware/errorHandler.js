const { logger } = require('../config/logger');

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  logger.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((item) => item.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate key error',
      errors: Object.keys(err.keyValue || {})
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.details || null
  });
}

module.exports = { notFound, errorHandler };
