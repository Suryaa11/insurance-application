const notificationRepository = require('../repositories/notificationRepository');

const notificationService = {
  createNotification: async (userId, message, category = 'GENERAL', metadata = {}) => {
    return notificationRepository.create({ user: userId, message, category, metadata });
  },
  listMine: (userId) => notificationRepository.findByUser(userId),
  unreadCount: (userId) => notificationRepository.unreadCount(userId),
  markRead: (notificationId, userId) => notificationRepository.markRead(notificationId, userId),
  markAllRead: (userId) => notificationRepository.markAllRead(userId)
};

module.exports = notificationService;
