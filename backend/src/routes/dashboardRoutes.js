const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN } = require('../constants/roles');

router.get('/customer', protect, dashboardController.customer);
router.get('/admin', protect, authorize(ADMIN), dashboardController.admin);

module.exports = router;
