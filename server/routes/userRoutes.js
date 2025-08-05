const express = require('express')
const router = express.Router()
const { saveProfile } = require('../controllers/userController.JS')

router.post('/save-profile', saveProfile)

module.exports = router