const { getAuth, getDatabase } = require("../config/DATABASE");

const registerSupplier = async (req, res) => {
  try {
    const { store_name, address, phone_number, password, category } = req.body;

    if (!store_name || !address || !phone_number || !password || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const auth = getAuth();
    const db = getDatabase();

    const userRecord = await auth.createUser({
      phoneNumber: phone_number,
      password,
      displayName: store_name,
    });

    await db.collection("suppliers").doc(userRecord.uid).set({
      store_name,
      address,
      phone_number,
      category,
      delivery_enabled: false,
      delivery_fee: 0,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "Supplier registered successfully",
      uid: userRecord.uid,
    });
  } catch (err) {
    console.error("Error registering supplier:", err);
    return res.status(500).json({ error: err.message });
  }
};

const loginSupplier = async (req, res) => {
  // Firebase Admin SDK doesn't handle password login — you'd normally do this from client using Firebase Auth.
  return res.status(501).json({
    error: "Login should be handled via Firebase client SDK",
  });
};

module.exports = { registerSupplier, loginSupplier };
