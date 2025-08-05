const { getDatabase } = require('../config/DATABASE.JS')

const createBoutique = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }

  const { 
    supplierId, 
    name, 
    description, 
    address, 
    phone, 
    email, 
    category, 
    logo, 
    banner,
    isActive = true 
  } = req.body

  if (!supplierId || !name || !description) {
    return res.status(400).json({ message: "Supplier ID, name, and description are required." })
  }

  try {
    const boutiqueData = {
      supplierId,
      name: name.trim(),
      description: description.trim(),
      address: address?.trim() || "",
      phone: phone?.trim() || "",
      email: email?.trim() || "",
      category: category?.trim() || "",
      logo: logo || "",
      banner: banner || "",
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("📝 Adding boutique:", boutiqueData)
    const result = await db.collection("boutiques").add(boutiqueData)
    
    const savedBoutique = { id: result.id, ...boutiqueData }
    console.log("✅ Boutique added successfully:", savedBoutique)
    
    res.status(201).json(savedBoutique)
  } catch (error) {
    console.error("❌ Error adding boutique:", error)
    res.status(500).json({ message: "Failed to add boutique.", error: error.message })
  }
}

const getBoutiquesBySupplier = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }

  const { supplierId } = req.params

  try {
    const boutiquesSnapshot = await db.collection("boutiques").where("supplierId", "==", supplierId).get()
    const boutiques = boutiquesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(boutiques)
  } catch (error) {
    console.error("Error fetching boutiques:", error)
    res.status(500).json({ message: "Failed to fetch boutiques.", error: error.message })
  }
}

const updateBoutique = async (req, res) => {
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
    await db.collection("boutiques").doc(id).update(updatedData)
    res.status(200).json({ message: "Boutique updated successfully." })
  } catch (error) {
    console.error("Error updating boutique:", error)
    res.status(500).json({ message: "Failed to update boutique.", error: error.message })
  }
}

const deleteBoutique = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }

  try {
    const { id } = req.params
    await db.collection("boutiques").doc(id).delete()
    res.status(200).json({ message: "Boutique deleted successfully." })
  } catch (error) {
    console.error("Error deleting boutique:", error)
    res.status(500).json({ message: "Failed to delete boutique.", error: error.message })
  }
}

module.exports = {
  createBoutique,
  getBoutiquesBySupplier,
  updateBoutique,
  deleteBoutique
}