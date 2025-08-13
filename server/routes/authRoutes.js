const express = require('express')
const router = express.Router()
const { 
registerSupplier, loginSupplier 
} = require('../controllers/authController')

const { 
  generateOTP, 
  verifyOTP, 
} = require('../controllers/OtpServiceController')
router.post('/generate', generateOTP)
router.post('/verify', verifyOTP)  

router.post('/register', registerSupplier)
router.post('/login', loginSupplier)   

module.exports = router