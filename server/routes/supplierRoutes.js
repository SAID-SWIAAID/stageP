const express = require('express')
const router = express.Router()
const { 
  createSupplier, 
  getSuppliers, 
  updateSupplier, 
  deleteSupplier 
} = require('../controllers/supplierController.JS')

router.post('/', createSupplier)
router.get('/', getSuppliers)
router.put('/:id', updateSupplier)
router.delete('/:id', deleteSupplier)

module.exports = router