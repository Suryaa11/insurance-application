const jwt = require('jsonwebtoken');
const { jwtAccessSecret, jwtRefreshSecret, jwtAccessExpiresIn, jwtRefreshExpiresIn } = require('../config/env');

function createAccessToken(user) {
  return jwt.sign(
    { role: user.role, refreshTokenVersion: user.refreshTokenVersion },
    jwtAccessSecret,
    { subject: user._id.toString(), expiresIn: jwtAccessExpiresIn }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { role: user.role, refreshTokenVersion: user.refreshTokenVersion },
    jwtRefreshSecret,
    { subject: user._id.toString(), expiresIn: jwtRefreshExpiresIn }
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtRefreshSecret);
}

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken };
