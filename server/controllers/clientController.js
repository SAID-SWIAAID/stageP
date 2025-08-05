const { getDatabase } = require('../config/DATABASE.JS')

const createClient = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const clientData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection("clients").add(clientData)
    res.status(201).json({ id: result.id, ...clientData })
  } catch (error) {
    console.error("Error adding client:", error)
    res.status(500).json({ message: "Failed to add client.", error: error.message })
  }
}

const getClients = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const clientsSnapshot = await db.collection("clients").get()
    const clients = clientsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    res.status(500).json({ message: "Failed to fetch clients.", error: error.message })
  }
}

const updateClient = async (req, res) => {
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
    await db.collection("clients").doc(id).update(updatedData)
    res.status(200).json({ message: "Client updated successfully." })
  } catch (error) {
    console.error("Error updating client:", error)
    res.status(500).json({ message: "Failed to update client.", error: error.message })
  }
}

const deleteClient = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  try {
    const { id } = req.params
    await db.collection("clients").doc(id).delete()
    res.status(200).json({ message: "Client deleted successfully." })
  } catch (error) {
    console.error("Error deleting client:", error)
    res.status(500).json({ message: "Failed to delete client.", error: error.message })
  }
}

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient
}