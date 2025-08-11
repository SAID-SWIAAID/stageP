const express = require('express')
const router = express.Router()
const { 
getSupplierProfile,
  updateSupplierProfile
} = require('../controllers/supplierController.JS')

router.get('/get', getSupplierProfile)
router.put('/:id', updateSupplierProfile)


module.exports = router