const express = require('express');
const router = express.Router();
const { 
  generateSupplierToken
} = require('../controllers/generateJwtTokenController');
router.post('/generate', generateSupplierToken);
module.exports = router;