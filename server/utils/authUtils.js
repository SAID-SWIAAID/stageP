const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_ISSUER, JWT_EXPIRES_IN } = require('../config/auth');

// Generate JWT token
exports.generateAuthToken = (userData) => {
  return jwt.sign({
    uid: userData.uid,
    phoneNumber: userData.phoneNumber,
    storeName: userData.storeName,
    role: 'supplier',
    otpVerified: userData.otpVerified || false
  }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
    algorithm: 'HS256'
  });
};

// Hash password
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Verify password
exports.verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};