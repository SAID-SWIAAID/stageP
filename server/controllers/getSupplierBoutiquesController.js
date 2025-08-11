// controllers/boutique/getSupplierBoutiquesController.js
const { getDatabase } = require("../config/DATABASE.JS");

const getSupplierBoutiques = async (req, res) => {
  const db = getDatabase();
  if (!db) {
    return res.status(500).json({ message: "Database not initialized" });
  }

  const { uid } = req.params;
  if (!uid) {
    return res.status(400).json({ message: "Missing supplier UID" });
  }

  try {
    // 1. Get user doc
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify userType
    const userData = userDoc.data();
    if (userData.userType !== "supplier") {
      return res.status(403).json({ message: "User is not a supplier" });
    }

    // 3. Get supplier document inside user's subcollection
    const supplierRef = db.collection("users").doc(uid).collection("suppliers").doc(uid);
    const supplierDoc = await supplierRef.get();

    if (!supplierDoc.exists) {
      return res.status(404).json({ message: "Supplier document not found" });
    }

    // 4. Fetch boutiques inside this supplier doc
    const boutiquesSnapshot = await supplierRef.collection("boutiques").get();
    const boutiques = boutiquesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(boutiques);
  } catch (error) {
    console.error("Error fetching boutiques for uid:", uid, error);
    return res.status(500).json({
      message: "Failed to fetch boutiques",
      error: error.message,
    });
  }
};

module.exports = { getSupplierBoutiques };
