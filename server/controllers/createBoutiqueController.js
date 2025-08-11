const { getDatabase, FieldValue } = require("../config/DATABASE.JS");

const createBoutique = async (req, res) => {
  const db = getDatabase();
  const { uid, name, description, address, phone, email, category } = req.body;

  if (!uid || !name || !description || !address || !phone || !email || !category) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const supplierRef = db.collection("users").doc(uid).collection("suppliers").doc(uid);
    const supplierDoc = await supplierRef.get();

    if (!supplierDoc.exists) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const boutiqueRef = supplierRef.collection("boutiques").doc(); // plural boutiques

    const boutiqueData = {
      name,
      description,
      address,
      phone,
      email,
      category,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await boutiqueRef.set(boutiqueData);

    res.status(200).json({ success: true, boutiqueId: boutiqueRef.id, data: boutiqueData });
  } catch (error) {
    console.error("Error creating boutique:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBoutique };
