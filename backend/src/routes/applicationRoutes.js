const router = require('express').Router();
const { body } = require('express-validator');
const applicationController = require('../controllers/applicationController');
const { validateRequest } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN } = require('../constants/roles');

router.post(
  '/',
  protect,
  authorize('CUSTOMER', ADMIN),
  [
    body('selectedPlan').notEmpty(),
    body('personalInformation.firstName').notEmpty(),
    body('personalInformation.lastName').notEmpty(),
    body('addressInformation.addressLine1').notEmpty(),
    body('addressInformation.city').notEmpty(),
    body('nomineeInformation.name').notEmpty()
  ],
  validateRequest,
  applicationController.submit
);
router.get('/mine', protect, applicationController.mine);
router.get('/admin', protect, authorize(ADMIN), applicationController.listForAdmin);
router.get('/:id', protect, applicationController.getById);
router.patch(
  '/:id/review',
  protect,
  authorize(ADMIN),
  [
    body('status').isIn(['APPROVED', 'REJECTED']),
    body('approvalComments').optional().isString(),
    body('rejectionReason').optional().isString()
  ],
  validateRequest,
  applicationController.review
);

module.exports = router;
