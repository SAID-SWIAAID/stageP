const { getDatabase, admin } = require("../config/DATABASE");
const jwt = require('jsonwebtoken');
const { validateSupplierUpdate } = require('../utils/validators');
require('dotenv').config();

// Validate environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || 'supplierApp';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'"
  });
  next();
};

// Enhanced token verification
const verifyToken = async (req, res, next) => {
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
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER
    });

    req.user = {
      uid: decoded.uid,
      phoneNumber: decoded.phoneNumber,
      storeName: decoded.storeName,
      role: decoded.role || 'supplier'
    };
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    
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
    } else {
      errorResponse.message = 'Authentication failed';
    }

    return res.status(401).json(errorResponse);
  }
};

// Rate limiting configuration (example using express-rate-limit)
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

const getSupplierProfile = async (req, res) => {
  try {
    // Check OTP verification if required
    if (process.env.REQUIRE_OTP === 'true' && !req.user.otpVerified) {
      return res.status(403).json({
        success: false,
        error: 'OTP verification required',
        code: 'OTP_REQUIRED'
      });
    }

    const db = getDatabase();
    const doc = await db.collection("suppliers")
      .doc(req.user.uid)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found',
        code: 'SUPPLIER_NOT_FOUND'
      });
    }

    const supplierData = doc.data();
    
    const responseData = {
      supplierInfo: {
        uid: supplierData.uid,
        storeName: supplierData.storeName,
        phoneNumber: supplierData.phoneNumber,
        category: supplierData.category,
        createdAt: supplierData.createdAt?.toDate() || null
      },
      businessInfo: {
        address: supplierData.address || {},
        deliverySettings: {
          enabled: supplierData.deliveryEnabled || false,
          fee: supplierData.deliveryFee || 0,
          radius: supplierData.deliveryRadius || 0,
          minOrder: supplierData.minOrderAmount || 0
        }
      },
      lastUpdated: supplierData.updatedAt?.toDate() || null
    };

    return res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (err) {
    console.error('Error fetching supplier profile:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch supplier data',
      code: 'FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const updateSupplierProfile = async (req, res) => {
  try {
    // Check OTP verification if required
    if (process.env.REQUIRE_OTP === 'true' && !req.user.otpVerified) {
      return res.status(403).json({
        success: false,
        error: 'OTP verification required',
        code: 'OTP_REQUIRED'
      });
    }

    const { isValid, error } = validateSupplierUpdate(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: error,
        code: 'VALIDATION_ERROR'
      });
    }

    const db = getDatabase();
    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Protect immutable fields
    const forbiddenFields = ['password', 'uid', 'createdAt', 'phoneNumber'];
    forbiddenFields.forEach(field => delete updateData[field]);

    // Atomic update
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection("suppliers").doc(req.user.uid);
      const doc = await transaction.get(docRef);
      
      if (!doc.exists) {
        throw new Error('Supplier not found');
      }
      
      transaction.update(docRef, updateData);
    });

    // Return updated data
    const updatedDoc = await db.collection("suppliers").doc(req.user.uid).get();
    const updatedData = updatedDoc.data();
    
    // Sanitize response
    delete updatedData.password;
    delete updatedData.isActive;

    return res.status(200).json({ 
      success: true,
      message: "Profile updated successfully",
      data: updatedData
    });
  } catch (err) {
    console.error('Error updating supplier profile:', err);
    
    const errorResponse = {
      success: false,
      error: 'Failed to update supplier profile',
      code: 'UPDATE_ERROR'
    };

    if (err.message === 'Supplier not found') {
      errorResponse.error = 'Supplier not found';
      errorResponse.code = 'SUPPLIER_NOT_FOUND';
      return res.status(404).json(errorResponse);
    }

    errorResponse.details = process.env.NODE_ENV === 'development' ? err.message : undefined;
    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  securityHeaders,
  verifyToken,
  apiLimiter,
  getSupplierProfile,
  updateSupplierProfile
};