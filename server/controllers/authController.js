const { getDatabase ,admin } = require("../config/DATABASE");
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { validatePhoneNumber } = require('../utils/validators');

const registerSupplier = async (req, res) => {
  try {
    const { 
      fullName, 
      storeName, 
      address,  // Expecting { street, city, state, country, zipCode }
      phoneNumber, 
      password, 
      category 
    } = req.body;

    // Validate Inputs
    const errors = [];
    
    if (!fullName?.trim()) errors.push('Full name is required');
    if (!storeName?.trim()) errors.push('Store name is required');
    if (!address?.street?.trim()) errors.push('Street address is required');
    if (!validatePhoneNumber(phoneNumber)) {
      errors.push('Phone number must be in format +212XXXXXXXXX');
    }
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!category?.trim()) errors.push('Category is required');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    const db = getDatabase();
    const now = admin.firestore.FieldValue.serverTimestamp();

    // Check for existing supplier
    const snapshot = await db.collection('suppliers')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.status(409).json({
        success: false,
        error: 'Supplier with this phone number already exists',
        code: 'PHONE_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create supplier document with complete structure
    const supplierRef = db.collection('suppliers').doc();
    const supplierData = {
      uid: supplierRef.id,
      fullName: fullName.trim(),
      storeName: storeName.trim(),
      address: {
        street: address.street.trim(),
        city: address.city?.trim() || '',
        state: address.state?.trim() || '',
        country: address.country?.trim() || 'Morocco', // Default to Morocco
        zipCode: address.zipCode?.trim() || ''
      },
      phoneNumber,
      password: hashedPassword,
      category: category.trim(),
      deliverySettings: {
        enabled: false,
        fee: 0,
        radius: 5, // Default 5km delivery radius
        minOrder: 0
      },
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      verificationStatus: 'pending' // For future email/phone verification
    };

    await supplierRef.set(supplierData);

    // Generate token (without sensitive data)
    const token = generateToken({
      uid: supplierRef.id,
      phoneNumber,
      storeName: storeName.trim(),
      role: 'supplier'
    });

    // Prepare response data
    const responseData = { ...supplierData };
    delete responseData.password;
    delete responseData.isActive;

    return res.status(201).json({
      success: true,
      message: "Supplier registered successfully",
      token,
      data: responseData
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ 
      success: false,
      error: "Registration failed",
      code: "REGISTRATION_ERROR",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const loginSupplier = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Enhanced validation
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ 
        success: false,
        error: "Valid phone number required",
        code: "INVALID_PHONE"
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ 
        success: false,
        error: "Password must be at least 8 characters",
        code: "INVALID_PASSWORD"
      });
    }

    const db = getDatabase();

    // Find supplier by phone number
    const snapshot = await db.collection('suppliers')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
        code: "SUPPLIER_NOT_FOUND"
      });
    }

    const supplierDoc = snapshot.docs[0];
    const supplierData = supplierDoc.data();

    // Check if account is active
    if (supplierData.isActive === false) {
      return res.status(403).json({
        success: false,
        error: "Account is inactive",
        code: "ACCOUNT_INACTIVE"
      });
    }

    // Verify password with timing-safe comparison
    const isMatch = await bcrypt.compare(password, supplierData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS"
      });
    }

    // Update last login time
    await supplierDoc.ref.update({
      lastLoginAt: new Date()
    });

    // Generate JWT token with expiration
    const token = generateToken({
      uid: supplierDoc.id,
      phoneNumber: supplierData.phoneNumber,
      storeName: supplierData.storeName,
      role: 'supplier'
    });

    // Prepare response data without sensitive information
    const responseData = {
      uid: supplierDoc.id,
      fullName: supplierData.fullName,
      storeName: supplierData.storeName,
      phoneNumber: supplierData.phoneNumber,
      address: supplierData.address,
      category: supplierData.category
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: responseData
    });

  } catch (err) {
    console.error("Login error:", err);
    
    return res.status(500).json({ 
      success: false,
      error: "Login failed",
      code: "LOGIN_ERROR",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { 
  registerSupplier, 
  loginSupplier 
};