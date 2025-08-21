// controllers/authController.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || "supplierApp";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Generate JWT Token for Supplier
const generateSupplierToken = (req, res) => {
  try {
    const { uid, phone_number, store_name } = req.body;

    if (!uid || !phone_number || !store_name) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: uid, phoneNumber, storeName",
        code: "MISSING_FIELDS"
      });
    }

    const payload = {
      uid,
      phone_number,
      store_name,
      role: "supplier"
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN,
      issuer: JWT_ISSUER
    });

    return res.status(200).json({
      success: true,
      token,
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (err) {
    console.error("Error generating supplier token:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate token",
      code: "TOKEN_GENERATION_ERROR"
    });
  }
};

module.exports = {
  generateSupplierToken
};
