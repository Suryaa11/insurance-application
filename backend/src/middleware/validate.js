const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  return next(new ApiError(400, 'Validation failed', result.array().map((error) => ({
    field: error.path,
    message: error.msg
  }))));
}

module.exports = { validateRequest };
