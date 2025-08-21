// routes/orders.js
const express = require("express");
const { getSupplierOrders } = require("../controllers/orderController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
router.use(verifyToken);
router.get("/", getSupplierOrders);

module.exports = router;
