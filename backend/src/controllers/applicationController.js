const asyncHandler = require('../utils/asyncHandler');
const applicationService = require('../services/applicationService');
const { sendResponse } = require('../utils/response');

const applicationController = {
  submit: asyncHandler(async (req, res) => {
    const application = await applicationService.submit(req.user._id, req.body);
    return sendResponse(res, 201, 'Application submitted', application);
  }),
  mine: asyncHandler(async (req, res) => {
    const applications = await applicationService.getMine(req.user._id);
    return sendResponse(res, 200, 'Applications fetched', applications);
  }),
  getById: asyncHandler(async (req, res) => {
    const application = await applicationService.getById(req.params.id, req.user);
    return sendResponse(res, 200, 'Application fetched', application);
  }),
  listForAdmin: asyncHandler(async (req, res) => {
    const result = await applicationService.listForAdmin(req.query);
    return sendResponse(res, 200, 'Applications fetched', result);
  }),
  review: asyncHandler(async (req, res) => {
    const result = await applicationService.review({
      applicationId: req.params.id,
      status: req.body.status,
      approvalComments: req.body.approvalComments,
      rejectionReason: req.body.rejectionReason,
      adminId: req.user._id
    });
    return sendResponse(res, 200, 'Application reviewed', result);
  })
};

module.exports = applicationController;
