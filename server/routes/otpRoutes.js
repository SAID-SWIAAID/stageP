const express = require('express')
const router = express.Router()
const { 
  generateOTP, 
  verifyOTP, 
} = require('../controllers/OtpServiceController')

router.post('/generate', generateOTP)
router.post('/verify', verifyOTP)   

module.exports = router