const { getDatabase } = require('../config/DATABASE.JS')

const deleteProduct = async (req, res) => {
  const db = getDatabase()
  if (!db) return res.status(500).json({ message: "Database not initialized." })

  try {
    const { id } = req.params
    await db.collection("products").doc(id).delete()
    res.status(200).json({ message: "Product deleted successfully." })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ message: "Failed to delete product.", error: error.message })
  }
}

module.exports = deleteProduct
