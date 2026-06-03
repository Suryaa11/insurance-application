const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');
const { sendResponse } = require('../utils/response');

const notificationController = {
  mine: asyncHandler(async (req, res) => {
    const notifications = await notificationService.listMine(req.user._id);
    return sendResponse(res, 200, 'Notifications fetched', notifications);
  }),
  markRead: asyncHandler(async (req, res) => {
    const notification = await notificationService.markRead(req.params.id, req.user._id);
    return sendResponse(res, 200, 'Notification marked as read', notification);
  }),
  markAllRead: asyncHandler(async (req, res) => {
    const result = await notificationService.markAllRead(req.user._id);
    return sendResponse(res, 200, 'Notifications marked as read', result);
  })
};

module.exports = notificationController;
