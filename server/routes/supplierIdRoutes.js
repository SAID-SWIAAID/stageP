const express = require('express');
const router = express.Router();
const { getSupplierByUid, updateSupplierByUid } = require('../controllers/supplierByIdController');
//const { validateUpdateSupplier } = require('../middleware/validationMiddleware');

router.get("/:uid", getSupplierByUid);

// Update supplier by UID
router.patch("/:uid", updateSupplierByUid);
module.exports = router;