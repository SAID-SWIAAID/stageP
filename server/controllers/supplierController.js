const { getDatabase, admin } = require('../config/DATABASE.JS')

const createSupplier = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const supplierData = {
      ...req.body,
      createdAt: admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date(),
      updatedAt: admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date(),
    }
    const docRef = await db.collection("suppliers").add(supplierData)
    res.status(201).json({ id: docRef.id, ...supplierData })
  } catch (error) {
    console.error("Error adding supplier:", error)
    res.status(500).json({ message: "Failed to add supplier.", error: error.message })
  }
}

const getSuppliers = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const suppliersSnapshot = await db.collection("suppliers").get()
    const suppliers = suppliersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.status(200).json({ suppliers })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    res.status(500).json({ message: "Failed to fetch suppliers.", error: error.message })
  }
}

const updateSupplier = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const { id } = req.params
    const updatedData = {
      ...req.body,
      updatedAt: admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date(),
    }
    await db.collection("suppliers").doc(id).update(updatedData)
    res.status(200).json({ message: "Supplier updated successfully." })
  } catch (error) {
    console.error("Error updating supplier:", error)
    res.status(500).json({ message: "Failed to update supplier.", error: error.message })
  }
}

const deleteSupplier = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const { id } = req.params
    await db.collection("suppliers").doc(id).delete()
    res.status(200).json({ message: "Supplier deleted successfully." })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    res.status(500).json({ message: "Failed to delete supplier.", error: error.message })
  }
}

module.exports = {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
}