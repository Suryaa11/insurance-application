const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { sendResponse } = require('../utils/response');

const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return sendResponse(res, 201, 'Registration successful', result);
  }),
  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    return sendResponse(res, 200, 'Login successful', result);
  }),
  refresh: asyncHandler(async (req, res) => {
    const result = await authService.refresh(req.body.refreshToken);
    return sendResponse(res, 200, 'Token refreshed', result);
  }),
  logout: asyncHandler(async (req, res) => {
    const result = await authService.logout(req.user.id);
    return sendResponse(res, 200, 'Logged out successfully', result);
  }),
  me: asyncHandler(async (req, res) => {
    const user = await authService.me(req.user.id);
    return sendResponse(res, 200, 'Profile fetched', user);
  })
};

module.exports = authController;
