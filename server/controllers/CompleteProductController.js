const { getDatabase, admin } = require("../config/DATABASE.JS");

const completeProfile = async (req, res) => {
  const db = getDatabase();

  if (!db) {
    return res.status(500).json({ message: "Database not initialized" });
  }

  const { uid, fullName, email, phoneNumber, userType } = req.body;

  try {
    // Create or update base user profile
    const userRef = db.collection("users").doc(uid);
    await userRef.set({
      uid,
      fullName,
      email,
      phoneNumber,
      userType,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // If the user is a supplier, also create a supplier document
    if (userType === "supplier") {
      const supplierRef = db.collection("suppliers").doc(uid);
      await supplierRef.set({
        name: fullName,
        email,
        phoneNumber,
        userId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    res.status(200).json({ message: "Profile completed successfully" });
  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({ message: "Failed to complete profile", error: error.message });
  }
};

module.exports = {
  completeProfile,
};
