const { getDatabase } = require('../config/DATABASE.JS')
const saveProfile = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  const { uid, name, email, phoneNumber, userType, boutiques } = req.body

  if (!uid || !name || !email || !phoneNumber || !userType) {
    return res.status(400).json({ message: "All fields are required." })
  }

  try {
    const userData = {
      uid,
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      userType: userType.trim(),
      boutiques: boutiques || [],
      profileCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Check if user already exists
    const existingUserQuery = await db.collection("users").where("uid", "==", uid).limit(1).get()
    
    if (!existingUserQuery.empty) {
      // Update existing user
      const existingDoc = existingUserQuery.docs[0]
      await existingDoc.ref.update({
        ...userData,
        updatedAt: new Date()
      })
      console.log(`Updated user profile for ${uid}`)
    } else {
      // Create new user
      await db.collection("users").add(userData)
      console.log(`Created new user profile for ${uid}`)
    }

    res.status(200).json({ message: "Profile saved successfully.", user: userData })
  } catch (error) {
    console.error("Error saving user profile:", error)
    res.status(500).json({ message: "Failed to save user profile.", error: error.message })
  }
}

module.exports = {
  saveProfile
}