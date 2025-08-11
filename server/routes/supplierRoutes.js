const express = require('express');
const router = express.Router();
const { 
  verifyToken,
  getSupplierProfile,
  updateSupplierProfile
} = require('../controllers/supplierController');

// Apply token verification middleware to all supplier routes
router.use(verifyToken);

// GET /api/v1/suppliers/get
router.get('/get', getSupplierProfile);

// PUT /api/v1/suppliers/:id (with ID validation)
router.put('/:id', async (req, res, next) => {
  // Verify the ID in URL matches the token's UID
  if (req.params.id !== req.decodedToken.uid) {
    return res.status(403).json({ 
      error: "Forbidden",
      message: "You can only update your own profile" 
    });
  }
  next();
}, updateSupplierProfile);

module.exports = router;