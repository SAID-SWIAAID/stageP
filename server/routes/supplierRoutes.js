const express = require('express');
const router = express.Router();
const { 
  getSupplierProfile,
  updateSupplierProfile
} = require('../controllers/supplierController');
const { verifyToken, apiLimiter } = require('../middleware/auth');
const { validateUpdateSupplier } = require('../middleware/validationMiddleware');

// Apply token verification to all supplier routes
router.use(verifyToken);

// GET /api/v1/suppliers - No need for verifyToken again!
router.get('/get', apiLimiter, getSupplierProfile);

// PUT /api/v1/suppliers
router.put('/update', 
  validateUpdateSupplier, 
  updateSupplierProfile
);

module.exports = router;