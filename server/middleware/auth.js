const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Configuration - UTILISEZ LE MÊME SECRET que pour la génération
const JWT_SECRET = process.env.JWT_SECRET ;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 100;

// Security headers middleware (identique)
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

// Rate limiting (identique)
exports.apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
  message: {
    success: false,
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ✅ Middleware adapté à VOTRE structure JWT
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

    const token = authHeader.substring(7);
    
    // Vérification avec VOTRE secret JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Construction de l'objet user selon VOTRE structure
    req.user = {
      uid: decoded.uid,
      phone_number: decoded.phone_number || '',
      store_name: decoded.store_name || '',
      role: decoded.role || 'supplier',
      issuer: decoded.iss || '', // SupplierApp
      issued_at: decoded.iat ? new Date(decoded.iat * 1000) : null,
      expires_at: decoded.exp ? new Date(decoded.exp * 1000) : null,
      ...decoded
    };

    console.log('✅ JWT verified for store:', req.user.store_name);
    console.log('👤 User UID:', req.user.uid);
    console.log('🏪 Store:', req.user.store_name);
    console.log('📞 Phone:', req.user.phone_number);
    console.log('🎯 Role:', req.user.role);
    
    next();

  } catch (err) {
    console.error('❌ JWT verification error:', err.message);
    
    let errorResponse = {
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    };

    if (err.name === 'TokenExpiredError') {
      errorResponse.message = 'Token expired';
      errorResponse.code = 'TOKEN_EXPIRED';
      errorResponse.expiredAt = err.expiredAt;
    } else if (err.name === 'JsonWebTokenError') {
      errorResponse.message = 'Invalid token';
      errorResponse.code = 'INVALID_TOKEN';
    }

    return res.status(401).json(errorResponse);
  }
};

// Middleware optionnel adapté
exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      
      req.user = {
        uid: decoded.uid,
        phone_number: decoded.phone_number || '',
        store_name: decoded.store_name || '',
        role: decoded.role || 'supplier',
        isAuthenticated: true
      };
    } catch (error) {
      req.user = { isAuthenticated: false };
    }
  } else {
    req.user = { isAuthenticated: false };
  }
  
  next();
};