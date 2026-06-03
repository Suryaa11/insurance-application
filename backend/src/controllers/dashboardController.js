const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');
const { sendResponse } = require('../utils/response');

const dashboardController = {
  customer: asyncHandler(async (req, res) => {
    const data = await dashboardService.customerDashboard(req.user._id);
    return sendResponse(res, 200, 'Dashboard fetched', data);
  }),
  admin: asyncHandler(async (req, res) => {
    const data = await dashboardService.adminDashboard();
    return sendResponse(res, 200, 'Dashboard fetched', data);
  })
};

module.exports = dashboardController;
