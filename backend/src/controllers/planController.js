const asyncHandler = require('../utils/asyncHandler');
const planService = require('../services/planService');
const { sendResponse } = require('../utils/response');

const planController = {
  list: asyncHandler(async (req, res) => {
    const plans = await planService.list();
    return sendResponse(res, 200, 'Plans fetched', plans);
  }),
  adminList: asyncHandler(async (req, res) => {
    const plans = await planService.listAll();
    return sendResponse(res, 200, 'Plans fetched', plans);
  }),
  getById: asyncHandler(async (req, res) => {
    const plan = await planService.getById(req.params.id);
    return sendResponse(res, 200, 'Plan fetched', plan);
  }),
  create: asyncHandler(async (req, res) => {
    const plan = await planService.create(req.body);
    return sendResponse(res, 201, 'Plan created', plan);
  }),
  update: asyncHandler(async (req, res) => {
    const plan = await planService.update(req.params.id, req.body);
    return sendResponse(res, 200, 'Plan updated', plan);
  }),
  remove: asyncHandler(async (req, res) => {
    await planService.remove(req.params.id);
    return sendResponse(res, 200, 'Plan deleted', null);
  })
};

module.exports = planController;
