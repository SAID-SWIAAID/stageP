const express = require('express')
const router = express.Router()
const { 
registerSupplier, loginSupplier 
} = require('../controllers/authController')

router.post('/register', registerSupplier)
router.post('/login', loginSupplier)   

module.exports = router