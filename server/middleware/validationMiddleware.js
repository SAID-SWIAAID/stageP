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


module.exports = { validateUpdateSupplier };