const { getDatabase } = require('../config/DATABASE.JS')

const createProduct = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      brand,
      model,
      sku,
      weight,
      dimensions,
      color,
      material,
      warranty,
      supplier,
      supplierId,
      boutiqueId,
      tags,
      images
    } = req.body

    // Validation with better error messages
    const missingFields = []
    
    if (!name) missingFields.push("Name")
    if (!price) missingFields.push("Price")
    if (!stock) missingFields.push("Stock")
    if (!category) missingFields.push("Category")
    if (!subcategory) missingFields.push("Subcategory")
    if (!supplierId) missingFields.push("Supplier ID")
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(", ")}. Please fill in all required fields.` 
      })
    }

    // Validate numeric fields
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." })
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Stock must be a non-negative number." })
    }

    if (weight && (isNaN(weight) || weight < 0)) {
      return res.status(400).json({ message: "Weight must be a non-negative number." })
    }

    const productData = {
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      subcategory: subcategory.trim(),
      brand: brand?.trim() || "",
      model: model?.trim() || "",
      sku: sku?.trim() || "",
      weight: weight ? Number(weight) : null,
      dimensions: dimensions?.trim() || "",
      color: color?.trim() || "",
      material: material?.trim() || "",
      warranty: warranty?.trim() || "",
      supplier: supplier?.trim() || "",
      supplierId: supplierId.trim(),
      boutiqueId: boutiqueId?.trim() || "",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      images: Array.isArray(images) ? images : [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("📝 Adding product:", productData)
    const result = await db.collection("products").add(productData)
    
    const savedProduct = { id: result.id, ...productData }
    console.log("✅ Product added successfully:", savedProduct)
    
    res.status(201).json(savedProduct)
  } catch (error) {
    console.error("❌ Error adding product:", error)
    res.status(500).json({ message: "Failed to add product.", error: error.message })
  }
}

const getProducts = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const { supplierId, boutiqueId } = req.query
    
    let productsSnapshot
    
    if (supplierId) {
      productsSnapshot = await db.collection("products").where("supplierId", "==", supplierId).get()
    } else if (boutiqueId) {
      productsSnapshot = await db.collection("products").where("boutiqueId", "==", boutiqueId).get()
    } else {
      productsSnapshot = await db.collection("products").get()
    }
    
    const products = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Failed to fetch products.", error: error.message })
  }
}

const updateProduct = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const { id } = req.params
    const updatedData = {
      ...req.body,
      updatedAt: new Date(),
    }
    await db.collection("products").doc(id).update(updatedData)
    res.status(200).json({ message: "Product updated successfully." })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ message: "Failed to update product.", error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const { id } = req.params
    await db.collection("products").doc(id).delete()
    res.status(200).json({ message: "Product deleted successfully." })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ message: "Failed to delete product.", error: error.message })
  }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
}