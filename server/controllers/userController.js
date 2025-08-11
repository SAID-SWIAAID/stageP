const { getDatabase } = require('../config/DATABASE.JS');

const saveProfile = async (req, res) => {
  const db = getDatabase();
  if (!db) return res.status(500).json({ message: "Database not initialized." });

  const { uid, phoneNumber, userType } = req.body;

  if (!uid || !phoneNumber) {
    return res.status(400).json({ message: "UID and phoneNumber are required." });
  }

  try {
    const userRef = db.collection("users").doc(uid);

    const userData = {
      phoneNumber: phoneNumber.trim(),
      userType: userType || null,
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Merge: create or update
    await userRef.set(userData, { merge: true });

    res.status(200).json({ message: "Partial profile saved.", user: { uid, ...userData } });
  } catch (error) {
    console.error("Error saving partial profile:", error);
    res.status(500).json({ message: "Failed to save partial profile.", error: error.message });
  }
};

module.exports = { saveProfile };
