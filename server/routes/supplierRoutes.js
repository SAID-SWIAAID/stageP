const express = require('express');
const router = express.Router();
const { 
  verifyToken,
  apiLimiter,
  getSupplierProfile,
  updateSupplierProfile
} = require('../controllers/supplierController');
const { validateUpdateSupplier } = require('../middleware/validationMiddleware');

// Apply token verification to all supplier routes
router.use(verifyToken);

// GET /api/v1/suppliers
router.get('/get',apiLimiter,verifyToken,getSupplierProfile);

// PUT /api/v1/suppliers
router.put('/update', 
  validateUpdateSupplier, 
  updateSupplierProfile
);

module.exports = router;