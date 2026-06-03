const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    category: {
      type: String,
      default: 'GENERAL',
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
