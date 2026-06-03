const Notification = require('../models/Notification');

const notificationRepository = {
  create: (data) => Notification.create(data),
  findByUser: (userId) => Notification.find({ user: userId }).sort({ createdAt: -1 }),
  findById: (id) => Notification.findById(id),
  markRead: (id, userId) => Notification.findOneAndUpdate({ _id: id, user: userId }, { read: true }, { new: true }),
  markAllRead: (userId) => Notification.updateMany({ user: userId, read: false }, { read: true }),
  unreadCount: (userId) => Notification.countDocuments({ user: userId, read: false })
};

module.exports = notificationRepository;
