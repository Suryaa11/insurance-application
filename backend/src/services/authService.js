const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/userRepository');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('./tokenService');
const { CUSTOMER } = require('../constants/roles');

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function generateAuthPayload(user) {
  return {
    user: sanitizeUser(user),
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user)
  };
}

const authService = {
  register: async ({ name, email, password }) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Email already exists');
    }

    const passwordHash = await require('bcryptjs').hash(password, 12);
    const user = await userRepository.create({ name, email, passwordHash, role: CUSTOMER });
    return generateAuthPayload(user);
  },
  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return generateAuthPayload(user);
  },
  refresh: async (refreshToken) => {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required');
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive || user.refreshTokenVersion !== payload.refreshTokenVersion) {
      throw new ApiError(401, 'Refresh token expired');
    }

    return generateAuthPayload(user);
  },
  logout: async (userId) => {
    const user = await userRepository.updateById(userId, { $inc: { refreshTokenVersion: 1 } });
    return { success: true, user: sanitizeUser(user) };
  },
  me: async (userId) => {
    const user = await userRepository.findById(userId);
    return sanitizeUser(user);
  }
};

module.exports = authService;
