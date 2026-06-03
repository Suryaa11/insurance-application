const router = require('express').Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN } = require('../constants/roles');

router.get('/summary', protect, authorize(ADMIN), reportController.summary);

module.exports = router;
