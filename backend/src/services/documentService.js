const ApiError = require('../utils/ApiError');
const documentRepository = require('../repositories/documentRepository');
const applicationRepository = require('../repositories/applicationRepository');
const notificationService = require('./notificationService');
const applicationService = require('./applicationService');
const { UPLOADED, UNDER_VERIFICATION, VERIFIED, REJECTED } = require('../constants/documentStatus');

const documentService = {
  upload: async ({ applicationId, customerId, file, documentName, documentType }) => {
    const application = await applicationRepository.findByIdRaw(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    if (application.customer.toString() !== customerId.toString()) {
      throw new ApiError(403, 'Forbidden');
    }

    const document = await documentRepository.create({
      application: applicationId,
      customer: customerId,
      documentName,
      documentType,
      filePath: `/uploads/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      status: UPLOADED
    });

    await notificationService.createNotification(
      customerId,
      `Document "${documentName}" has been uploaded.`,
      'DOCUMENT',
      { applicationId, documentId: document._id }
    );

    return documentRepository.findById(document._id);
  },
  listByApplication: async (applicationId, user) => {
    const application = await applicationRepository.findByIdRaw(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    if (user.role !== 'ADMIN' && application.customer.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return documentRepository.findByApplication(applicationId);
  },
  listByCustomer: (customerId) => documentRepository.findByCustomer(customerId),
  getById: async (id, user) => {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new ApiError(404, 'Document not found');
    }
    if (user.role !== 'ADMIN' && document.customer._id.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return document;
  },
  replaceRejected: async ({ documentId, customerId, file, documentName, documentType }) => {
    const document = await documentRepository.findByIdRaw(documentId);
    if (!document) {
      throw new ApiError(404, 'Document not found');
    }
    if (document.customer.toString() !== customerId.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    if (document.status !== REJECTED) {
      throw new ApiError(400, 'Only rejected documents can be replaced');
    }

    const updated = await documentRepository.updateById(documentId, {
      documentName: documentName || document.documentName,
      documentType: documentType || document.documentType,
      filePath: `/uploads/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      status: UPLOADED,
      rejectionReason: '',
      reviewedBy: null
    });

    await notificationService.createNotification(
      customerId,
      `Document "${updated.documentName}" has been replaced.`,
      'DOCUMENT',
      { documentId: updated._id, applicationId: updated.application }
    );

    return updated;
  },
  verify: async ({ documentId, adminId, status, rejectionReason = '' }) => {
    const document = await documentRepository.findByIdRaw(documentId);
    if (!document) {
      throw new ApiError(404, 'Document not found');
    }

    const nextStatus = status === VERIFIED ? VERIFIED : REJECTED;
    const updated = await documentRepository.updateById(documentId, {
      status: nextStatus,
      rejectionReason: nextStatus === REJECTED ? rejectionReason : '',
      reviewedBy: adminId
    });

    const message = nextStatus === VERIFIED
      ? `Document "${updated.documentName}" has been verified.`
      : `Document "${updated.documentName}" has been rejected.`;

    await notificationService.createNotification(updated.customer, message, 'DOCUMENT', {
      documentId: updated._id,
      applicationId: updated.application
    });

    if (nextStatus === VERIFIED) {
      await applicationService.updateStatusToPendingIfDocumentsVerified(updated.application);
    }

    return updated;
  },
  countByApplication: (applicationId) => documentRepository.countByApplication(applicationId)
};

module.exports = documentService;
