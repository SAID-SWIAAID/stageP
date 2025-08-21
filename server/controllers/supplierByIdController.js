// controllers/supplierController.js
const { getDatabase } = require("../config/DATABASE");
const { validateSupplierUpdate } = require('../utils/validators');
// ===== Get Supplier by UID =====
const getSupplierByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: "UID is required" 
      });
    }

    const db = getDatabase();
    const doc = await db.collection("suppliers").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: "Supplier not found" 
      });
    }

    const supplierData = doc.data();
    
    // Return public data only
    return res.status(200).json({ 
      success: true, 
      message: "Supplier fetched successfully", 
      data: {
        uid: supplierData.uid,
        store_name: supplierData.store_name,
        phone_number: supplierData.phone_number,
        category: supplierData.category,
        createdAt: supplierData.createdAt?.toDate() || null
      },
      businessInfo: {
        address: supplierData.address || {},
        deliverySettings: {
          enabled: supplierData.deliveryEnabled || false,
          fee: supplierData.deliveryFee || 0,
          radius: supplierData.deliveryRadius || 0,
          minOrder: supplierData.minOrderAmount || 0
        }
      },
      lastUpdated: supplierData.updatedAt?.toDate() || null
    });
  } catch (err) {
    console.error("Get supplier error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch supplier data" 
    });
  }
};

// ===== Update Supplier by UID =====
const updateSupplierByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: "UID is required" 
      });
    }

    const { isValid, error } = validateSupplierUpdate(req.body);
    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: error 
      });
    }

    const db = getDatabase();
    const docRef = db.collection("suppliers").doc(uid);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: "Supplier not found" 
      });
    }

    // Allowed fields for update
    const allowedFields = ['store_name', 'phone_number','address', 'password','category'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });
    
    updateData.updatedAt = new Date();

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    
    const updatedData = updatedDoc.data();

    return res.status(200).json({ 
      success: true, 
      message: "Supplier updated successfully", 
  });
  } catch (err) {
    console.error("Update supplier error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update supplier" 
    });
  }
};

module.exports = {
  getSupplierByUid,
  updateSupplierByUid
};