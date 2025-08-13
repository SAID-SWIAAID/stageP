require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER || 'http://localhost:3000/api/v1/suppliers',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  REQUIRE_OTP: process.env.REQUIRE_OTP === 'true',
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100
};

if (!module.exports.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}