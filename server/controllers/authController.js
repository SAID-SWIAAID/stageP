const { getDatabase, admin } = require("../config/DATABASE");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here"; // put in .env in production

const registerSupplier = async (req, res) => {
  try {
    const { FullName, store_name, address, phone_number, password, category } = req.body;

    if (!FullName || !store_name || !address || !phone_number || !password || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = getDatabase();

    // Hash password locally
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Firebase Auth user with phoneNumber and password
    const userRecord = await admin.auth().createUser({
      phoneNumber: phone_number,
      password, // Firebase requires actual password here for user creation
      displayName: store_name,
    });

    // Store supplier info + hashed password in Firestore
    await db.collection("suppliers").doc(userRecord.uid).set({
      FullName,
      store_name,
      address,
      phone_number,
      category,
      hashedPassword,
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
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      return res.status(400).json({ error: "Phone number and password required" });
    }

    const db = getDatabase();

    // Query supplier by phone_number
    const supplierQuery = db.collection("suppliers").where("phone_number", "==", phone_number);
    const snapshot = await supplierQuery.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const supplierDoc = snapshot.docs[0];
    const supplierData = supplierDoc.data();

    if (!supplierData.hashedPassword) {
      return res.status(400).json({ error: "No password set for this supplier" });
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, supplierData.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const tokenPayload = {
      uid: supplierDoc.id,
      phone_number: supplierData.phone_number,
      store_name: supplierData.store_name,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerSupplier, loginSupplier };
