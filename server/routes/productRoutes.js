const express = require('express');
const router = express.Router();
const { 
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { verifyToken, apiLimiter } = require('../middleware/auth');
const { validateCreateProduct, validateUpdateProduct } = require('../middleware/validationMiddleware');

// All routes require JWT authentication
router.use(verifyToken);

// GET /api/v1/products - List all products with filtering
router.get('/', apiLimiter, getAllProducts);

// POST /api/v1/products - Create new product
router.post('/', validateCreateProduct, createProduct);

// GET /api/v1/products/:productId - Get specific product
router.get('/:productId', apiLimiter, getProductById);

// PATCH /api/v1/products/:productId - Update product
router.patch('/:productId', validateUpdateProduct, updateProduct);

// DELETE /api/v1/products/:productId - Delete product
router.delete('/:productId', deleteProduct);

module.exports = router;
