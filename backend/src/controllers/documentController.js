const asyncHandler = require('../utils/asyncHandler');
const documentService = require('../services/documentService');
const { sendResponse } = require('../utils/response');

const documentController = {
  upload: asyncHandler(async (req, res) => {
    const document = await documentService.upload({
      applicationId: req.params.applicationId,
      customerId: req.user._id,
      file: req.file,
      documentName: req.body.documentName,
      documentType: req.body.documentType
    });
    return sendResponse(res, 201, 'Document uploaded', document);
  }),
  mine: asyncHandler(async (req, res) => {
    const documents = await documentService.listByCustomer(req.user._id);
    return sendResponse(res, 200, 'Documents fetched', documents);
  }),
  byApplication: asyncHandler(async (req, res) => {
    const documents = await documentService.listByApplication(req.params.applicationId, req.user);
    return sendResponse(res, 200, 'Documents fetched', documents);
  }),
  getById: asyncHandler(async (req, res) => {
    const document = await documentService.getById(req.params.id, req.user);
    return sendResponse(res, 200, 'Document fetched', document);
  }),
  accessUrl: asyncHandler(async (req, res) => {
    const result = await documentService.getAccessUrl(req.params.id, req.user);
    return sendResponse(res, 200, 'Access URL generated', result);
  }),
  replaceRejected: asyncHandler(async (req, res) => {
    const document = await documentService.replaceRejected({
      documentId: req.params.id,
      customerId: req.user._id,
      file: req.file,
      documentName: req.body.documentName,
      documentType: req.body.documentType
    });
    return sendResponse(res, 200, 'Document replaced', document);
  }),
  verify: asyncHandler(async (req, res) => {
    const document = await documentService.verify({
      documentId: req.params.id,
      adminId: req.user._id,
      status: req.body.status,
      rejectionReason: req.body.rejectionReason
    });
    return sendResponse(res, 200, 'Document reviewed', document);
  })
};

module.exports = documentController;
