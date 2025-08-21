const { body, validationResult } = require('express-validator');

const validateUpdateSupplier = [
  body('companyName').optional().isString().trim().escape(),
  body('contactEmail').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

const validateCreateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock_quantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('unit')
    .notEmpty()
    .withMessage('Unit is required')
    .isIn(['kg', 'g', 'piece', 'liter', 'ml', 'pack'])
    .withMessage('Unit must be one of: kg, g, piece, liter, ml, pack'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

const validateUpdateProduct = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters')
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('unit')
    .optional()
    .isIn(['kg', 'g', 'piece', 'liter', 'ml', 'pack'])
    .withMessage('Unit must be one of: kg, g, piece, liter, ml, pack'),
  body('category')
    .optional()
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

module.exports = { 
  validateUpdateSupplier,
  validateCreateProduct,
  validateUpdateProduct
};