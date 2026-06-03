const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { uploadDir } = require('../config/env');
const ApiError = require('../utils/ApiError');

const absoluteUploadDir = path.resolve(__dirname, '../../', uploadDir);

if (!fs.existsSync(absoluteUploadDir)) {
  fs.mkdirSync(absoluteUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, absoluteUploadDir);
  },
  filename(req, file, cb) {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

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

module.exports = { upload, absoluteUploadDir };
