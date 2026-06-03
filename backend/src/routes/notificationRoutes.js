const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/mine', protect, notificationController.mine);
router.patch('/:id/read', protect, notificationController.markRead);
router.patch('/read-all', protect, notificationController.markAllRead);

module.exports = router;
