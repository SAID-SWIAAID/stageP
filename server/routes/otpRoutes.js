const express = require('express')
const router = express.Router()
const { 
  generateOTP, 
  verifyOTP, 
  registerUser, 
  cleanupExpiredOTPs, 
  getOTPStatus 
} = require('../controllers/otpController.JS')

router.post('/generate', generateOTP)
router.post('/verify', verifyOTP)   
router.post('/register', registerUser)
router.post('/cleanup', cleanupExpiredOTPs)
router.get('/status/:phoneNumber', getOTPStatus)

module.exports = router