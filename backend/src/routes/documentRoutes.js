const router = require('express').Router();
const { body } = require('express-validator');
const documentController = require('../controllers/documentController');
const { validateRequest } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN } = require('../constants/roles');
const { upload } = require('../middleware/upload');

router.get('/mine', protect, documentController.mine);
router.get('/application/:applicationId', protect, documentController.byApplication);
router.get('/:id', protect, documentController.getById);
router.post(
  '/applications/:applicationId',
  protect,
  upload.single('file'),
  [
    body('documentName').notEmpty(),
    body('documentType').notEmpty()
  ],
  validateRequest,
  documentController.upload
);
router.put(
  '/:id/replace',
  protect,
  upload.single('file'),
  [
    body('documentName').optional().isString(),
    body('documentType').optional().isString()
  ],
  validateRequest,
  documentController.replaceRejected
);
router.patch(
  '/:id/review',
  protect,
  authorize(ADMIN),
  [
    body('status').isIn(['VERIFIED', 'REJECTED']),
    body('rejectionReason').optional().isString()
  ],
  validateRequest,
  documentController.verify
);

module.exports = router;
