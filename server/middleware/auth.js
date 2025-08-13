const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { 
  JWT_SECRET, 
  JWT_ISSUER,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX 
} = require('../config/auth');

// Security headers middleware
exports.securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'"
  });
  next();
};

// Rate limiting
exports.apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
  message: {
    success: false,
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Token verification
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header missing',
        code: 'MISSING_AUTH_HEADER'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization format',
        code: 'INVALID_AUTH_FORMAT'
      });
    }

    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER
    });
    
    next();
  } catch (err) {
    const errorResponse = {
      success: false,
      error: 'Unauthorized',
      code: 'AUTH_FAILED'
    };

    if (err.name === 'TokenExpiredError') {
      errorResponse.message = 'Token expired';
      errorResponse.code = 'TOKEN_EXPIRED';
    } else if (err.name === 'JsonWebTokenError') {
      errorResponse.message = 'Invalid token';
      errorResponse.code = 'INVALID_TOKEN';
    }

    return res.status(401).json(errorResponse);
  }
};