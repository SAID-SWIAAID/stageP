  const { admin } = require("../config/DATABASE");

  const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    const idToken = authHeader.split(" ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      req.user = decodedToken; // contains uid, email, etc.
      next();
    } catch (err) {
      console.error("Token verification failed", err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  module.exports = authenticate;
