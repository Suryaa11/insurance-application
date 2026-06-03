const router = require('express').Router();
const authRoutes = require('./authRoutes');
const planRoutes = require('./planRoutes');
const applicationRoutes = require('./applicationRoutes');
const documentRoutes = require('./documentRoutes');
const notificationRoutes = require('./notificationRoutes');
const reportRoutes = require('./reportRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/applications', applicationRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
