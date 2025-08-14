const jwt = require('jsonwebtoken');
require('dotenv').config();

// Validate environment variables on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_ISSUER = process.env.JWT_ISSUER || 'SupplierApp';

module.exports = {
  /**
   * Generates a JWT token with payload
   * @param {Object} payload - Data to include in token
   * @returns {String} JWT token
   */
  generateToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: JWT_ISSUER,
      algorithm: 'HS256' // Explicitly specify algorithm
    });
  },
  
  /**
   * Verifies a JWT token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid or expired
   */
  verifyToken: (token) => {
    try {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      return jwt.verify(cleanToken, JWT_SECRET, {
        issuer: JWT_ISSUER,
        algorithms: ['HS256']
      });
    } catch (err) {
      // More specific error messages
      if (err.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw new Error('Authentication failed');
    }
  },
  
  /**
   * Attaches token to response headers
   * @param {Object} res - Express response object
   * @param {Object} payload - Data to include in token
   * @returns {String} The generated token
   */
  attachTokenToResponse: (res, payload) => {
    const token = this.generateToken(payload);
    res.setHeader('Authorization', `Bearer ${token}`);
    return token;
  },
  
  /**
   * Middleware for Express authentication
   */
  authenticate: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }
      
      const decoded = this.verifyToken(authHeader);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
};