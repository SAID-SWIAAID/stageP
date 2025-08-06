const { getDatabase } = require('../config/DATABASE.JS')
const saveProfile = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
    const { uid, phoneNumber } = req.body;
    console.log("👉 Saving partial profile for UID:", req.body) ;
  if (!uid || !phoneNumber) {
    return res.status(400).json({ message: "UID and phoneNumber are required." });
  }


  try {
    const userData = {
      uid,
      phoneNumber: phoneNumber.trim(),
      profileCompleted: false, // or true if you want
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if user already exists
      const existingUserQuery = await db.collection("users").where("uid", "==", uid).limit(1).get();
    
     if (!existingUserQuery.empty) {
      const existingDoc = existingUserQuery.docs[0];
      await existingDoc.ref.update({
        ...userData,
        updatedAt: new Date(),
      });
      console.log(`Updated partial user profile for ${uid}`);
    } else {
      await db.collection("users").add(userData);
      console.log(`Created new partial user profile for ${uid}`);
    }


   
    res.status(200).json({ message: "Partial profile saved.", user: userData });
  } catch (error) {
    console.error("Error saving partial profile:", error);
    res.status(500).json({ message: "Failed to save partial profile.", error: error.message });
  }
};
module.exports = {
  saveProfile
}