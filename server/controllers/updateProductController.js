const { getDatabase } = require('../config/DATABASE.JS')
const admin = require('firebase-admin')

const updateProduct = async (req, res) => {
  const db = getDatabase()
  if (!db) return res.status(500).json({ message: "Database not initialized." })

  try {
    const { id } = req.params
    const updatedData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
    await db.collection("products").doc(id).update(updatedData)
    res.status(200).json({ message: "Product updated successfully." })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ message: "Failed to update product.", error: error.message })
  }
}

module.exports = updateProduct
