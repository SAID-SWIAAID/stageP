const { getDatabase, admin } = require("../config/DATABASE");

// GET /api/v1/products - List all products with filtering
const getAllProducts = async (req, res) => {
  try {
    const db = getDatabase();
    const supplierId = req.user.uid;
    
    // Query parameters for filtering
    const { category, in_stock, search, limit = 20, offset = 0 } = req.query;
    
    let query = db.collection('products')
      .where('supplierId', '==', supplierId);
    
    // Apply only ONE additional filter to avoid complex index requirements
    // Priority: category > stock_quantity
    if (category) {
      query = query.where('category', '==', category);
    } else if (in_stock === 'true') {
      query = query.where('stock_quantity', '>', 0);
    } else if (in_stock === 'false') {
      query = query.where('stock_quantity', '==', 0);
    }
    
    // Execute query and sort in memory for small datasets
    const snapshot = await query
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();
    
    let products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in memory by createdAt (newest first)
    products.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toDate() - a.createdAt.toDate();
      }
      return 0;
    });

    // Apply additional filtering in memory if needed
    if (category && in_stock) {
      // Both filters requested - apply stock filter in memory since category was applied in DB
      products = products.filter(product => {
        if (in_stock === 'true') {
          return product.stock_quantity > 0;
        } else if (in_stock === 'false') {
          return product.stock_quantity === 0;
        }
        return true;
      });
    }

    // Filter by search term if provided
    if (search) {
      products = products.filter(product => 
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return res.status(200).json({
      success: true,
      data: {
        products: products,
        total: products.length,
        filters: { category, in_stock, search },
        pagination: { limit: parseInt(limit), offset: parseInt(offset) }
      }
    });
    
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve products",
      code: "PRODUCTS_FETCH_ERROR"
    });
  }
};

// POST /api/v1/products - Create new product
const createProduct = async (req, res) => {
  try {
    const db = getDatabase();
    const supplierId = req.user.uid;
    const now = admin.firestore.FieldValue.serverTimestamp();
    
    const {
      name,
      description,
      price,
      stock_quantity,
      unit,
      category,
      image_url,
      is_active = true
    } = req.body;
    
    // Create product document
    const productRef = db.collection('products').doc();
    const productData = {
      id: productRef.id,
      supplierId,
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      stock_quantity: parseInt(stock_quantity),
      unit: unit.trim(),
      category: category.trim(),
      image_url: image_url || '',
      is_active,
      createdAt: now,
      updatedAt: now
    };
    
    await productRef.set(productData);
    
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        id: productRef.id,
        ...productData
      }
    });
    
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to create product",
      code: "PRODUCT_CREATE_ERROR"
    });
  }
};

// GET /api/v1/products/:productId - Get specific product
const getProductById = async (req, res) => {
  try {
    const db = getDatabase();
    const { productId } = req.params;
    const supplierId = req.user.uid;
    
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND"
      });
    }
    
    const productData = productDoc.data();
    
    // Check if product belongs to the authenticated supplier
    if (productData.supplierId !== supplierId) {
      return res.status(403).json({
        success: false,
        error: "Access denied - Product belongs to another supplier",
        code: "ACCESS_DENIED"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: productDoc.id,
        ...productData
      }
    });
    
  } catch (err) {
    console.error("Get product error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve product",
      code: "PRODUCT_FETCH_ERROR"
    });
  }
};

// PATCH /api/v1/products/:productId - Update product
const updateProduct = async (req, res) => {
  try {
    const db = getDatabase();
    const { productId } = req.params;
    const supplierId = req.user.uid;
    const now = admin.firestore.FieldValue.serverTimestamp();
    
    // Get current product
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND"
      });
    }
    
    const currentData = productDoc.data();
    
    // Check ownership
    if (currentData.supplierId !== supplierId) {
      return res.status(403).json({
        success: false,
        error: "Access denied - Product belongs to another supplier",
        code: "ACCESS_DENIED"
      });
    }
    
    // Prepare update data
    const updateData = { updatedAt: now };
    const allowedFields = ['name', 'description', 'price', 'stock_quantity', 'unit', 'category', 'image_url', 'is_active'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'price') {
          updateData[field] = parseFloat(req.body[field]);
        } else if (field === 'stock_quantity') {
          updateData[field] = parseInt(req.body[field]);
        } else if (typeof req.body[field] === 'string') {
          updateData[field] = req.body[field].trim();
        } else {
          updateData[field] = req.body[field];
        }
      }
    });
    
    // Update product
    await productDoc.ref.update(updateData);
    
    // Get updated data
    const updatedDoc = await productDoc.ref.get();
    
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
    
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update product",
      code: "PRODUCT_UPDATE_ERROR"
    });
  }
};

// DELETE /api/v1/products/:productId - Delete product
const deleteProduct = async (req, res) => {
  try {
    const db = getDatabase();
    const { productId } = req.params;
    const supplierId = req.user.uid;
    
    // Get product to check ownership
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND"
      });
    }
    
    const productData = productDoc.data();
    
    // Check ownership
    if (productData.supplierId !== supplierId) {
      return res.status(403).json({
        success: false,
        error: "Access denied - Product belongs to another supplier",
        code: "ACCESS_DENIED"
      });
    }
    
    // Delete product
    await productDoc.ref.delete();
    
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {
        id: productId,
        name: productData.name
      }
    });
    
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to delete product",
      code: "PRODUCT_DELETE_ERROR"
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
