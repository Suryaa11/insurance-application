const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.me);

module.exports = router;
