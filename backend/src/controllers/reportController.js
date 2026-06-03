const asyncHandler = require('../utils/asyncHandler');
const reportService = require('../services/reportService');
const { sendResponse } = require('../utils/response');

const reportController = {
  summary: asyncHandler(async (req, res) => {
    const report = await reportService.summary();
    return sendResponse(res, 200, 'Report summary fetched', report);
  })
};

module.exports = reportController;
