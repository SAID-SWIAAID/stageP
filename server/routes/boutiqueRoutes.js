const express = require('express')
const router = express.Router()
const { 
  createBoutique, 
  getBoutiquesBySupplier, 
  updateBoutique, 
  deleteBoutique 
} = require('../controllers/boutiqueController.JS')

router.post('/', createBoutique)
router.get('/:supplierId', getBoutiquesBySupplier)
router.put('/:id', updateBoutique)
router.delete('/:id', deleteBoutique)

module.exports = router