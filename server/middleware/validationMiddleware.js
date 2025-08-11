const verifyToken = async (req, res, next) => {
  try {
    // Check both headers and query params
    const authHeader = req.headers.authorization || `Bearer ${req.query.authorization}`;
    
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        error: "Unauthorized",
        message: "Authorization token required in format: Bearer <token>"
      });
    }

    const token = authHeader.split(" ")[1];
    req.user = await verifyTokenFunction(token); // Your token verification logic
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Invalid or expired token"
    });
  }
};