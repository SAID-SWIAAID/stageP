const { getDatabase } = require('../config/DATABASE.JS')

const getProducts = async (req, res) => {
  const db = getDatabase()
  if (!db) return res.status(500).json({ message: "Database not initialized." })

  try {
    const { supplierId, boutiqueId } = req.query
    let query = db.collection("products")
    if (supplierId) query = query.where("supplierId", "==", supplierId)
    if (boutiqueId) query = query.where("boutiqueId", "==", boutiqueId)

    const snapshot = await query.get()
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Failed to fetch products.", error: error.message })
  }
}

module.exports = getProducts
