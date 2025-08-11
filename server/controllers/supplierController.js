const { getDatabase, admin } = require("../config/DATABASE");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith("Bearer ")) {
      const error = new Error('Authorization token required');
      error.statusCode = 401;
      throw error;
    }

    const idToken = authHeader.split(" ")[1];
    req.decodedToken = await getAuth().verifyIdToken(idToken);
    next();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};

const getSupplierProfile = async (req, res, next) => {
  try {
    const db = getDatabase();
    const doc = await db.collection("suppliers").doc(req.decodedToken.uid).get();

    if (!doc.exists) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: doc.data()
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const updateSupplierProfile = async (req, res, next) => {
  try {
    const db = getDatabase();
    const uid = req.decodedToken.uid;

    await db.collection("suppliers").doc(uid).set(
      {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ 
      success: true,
      message: "Profile updated successfully"
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  verifyToken,
  getSupplierProfile,
  updateSupplierProfile
};