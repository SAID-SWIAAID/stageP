const { getDatabase, getAuth, admin } = require("../config/DATABASE.JS");

const db = getDatabase();
const auth = getAuth();

// GET /api/v1/supplier/profile
const getSupplierProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const idToken = authHeader.split(" ")[1];
    const decoded = await auth.verifyIdToken(idToken);

    const doc = await db.collection("suppliers").doc(decoded.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(doc.data());
  } catch (err) {
    console.error("Error fetching supplier profile:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// PATCH /api/v1/supplier/profile
const updateSupplierProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const idToken = authHeader.split(" ")[1];
    const decoded = await auth.verifyIdToken(idToken);

    await db.collection("suppliers").doc(decoded.uid).set(
      {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Error updating supplier profile:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSupplierProfile,
  updateSupplierProfile,
};
