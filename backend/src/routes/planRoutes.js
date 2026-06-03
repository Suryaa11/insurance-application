const router = require('express').Router();
const { body } = require('express-validator');
const planController = require('../controllers/planController');
const { validateRequest } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN } = require('../constants/roles');

router.get('/', planController.list);
router.get('/admin', protect, authorize(ADMIN), planController.adminList);
router.get('/:id', planController.getById);
router.post(
  '/',
  protect,
  authorize(ADMIN),
  [
    body('planName').notEmpty(),
    body('description').notEmpty(),
    body('coverageAmount').isNumeric(),
    body('premiumAmount').isNumeric(),
    body('eligibilityCriteria').notEmpty()
  ],
  validateRequest,
  planController.create
);
router.put('/:id', protect, authorize(ADMIN), planController.update);
router.delete('/:id', protect, authorize(ADMIN), planController.remove);

module.exports = router;
