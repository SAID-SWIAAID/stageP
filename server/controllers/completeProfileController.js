const { getDatabase } = require("../config/DATABASE.JS");

const completeProfile = async (req, res) => {
  const db = getDatabase();
  if (!db) return res.status(500).json({ message: "Database not initialized." });

  const { uid, name, email, phoneNumber, userType } = req.body;

  if (!uid || !name || !email || !phoneNumber || !userType) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const userRef = db.collection("users").doc(uid);

    // Update user document
    await userRef.set(
      {
        name,
        email,
        phoneNumber,
        userType,
        profileCompleted: true,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // If user is supplier, add supplier doc to subcollection under this user
    if (userType === "supplier") {
      const supplierSubRef = userRef.collection("suppliers").doc(uid);

      await supplierSubRef.set({
        name,
        fullName: name,
        email,
        phoneNumber,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const updatedUserSnap = await userRef.get();
    const updatedUser = { uid, ...updatedUserSnap.data() };

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { completeProfile };
