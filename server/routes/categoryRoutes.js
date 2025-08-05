const express = require('express')
const router = express.Router()
const { getCategories } = require('../controllers/categoryController.JS')

router.get('/', getCategories)

module.exports = router