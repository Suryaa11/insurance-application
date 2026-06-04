const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Only PDF, JPG, and PNG files are allowed'));
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { upload };
