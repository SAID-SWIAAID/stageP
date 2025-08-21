const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { initializeDatabase } = require("./config/DATABASE");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ✅ IMPORTEZ VOTRE MIDDLEWARE D'AUTHENTIFICATION
const { verifyToken, securityHeaders, apiLimiter: authLimiter } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const path = process.env.API_BASE_PATH || '/api/v1';

// =======================
//  Security Middlewares
// =======================
app.use(helmet());
app.use(securityHeaders); // ✅ AJOUTEZ VOS HEADERS DE SÉCURITÉ
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later"
});

// =======================
//  Application Middlewares
// =======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(apiLimiter);

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// =======================
//  Database Initialization
// =======================
(async () => {
  try {
    await initializeDatabase();
    console.log("✅ Database initialized successfully");

    // Import routes
    const tokenRoute  = require("./routes/tokenRoute");
    const authRoutes = require("./routes/authRoutes");
    const supplierRoutes = require("./routes/supplierRoutes");
    const orderRoutes = require("./routes/orderRoutes");
    const supplierIdRoutes = require("./routes/supplierIdRoutes");  
    const productRoutes = require("./routes/productRoutes");
    // Setup routes
    app.get("/api/health", (req, res) => res.json({ status: "OK" }));
    app.get("/said", (req, res) => res.send("Backend server is running!"));
    
    // ✅ Routes publiques (sans authentication)
    app.use(`${path}/auth`, authRoutes);
    app.use(`${path}/token`, tokenRoute);

    
    app.use(`${path}/suppliers/profile`, supplierRoutes);
    app.use(`${path}/orders`, orderRoutes);
    app.use(`${path}/suppliers/profile1`, supplierIdRoutes);
    app.use(`${path}/products`, productRoutes);
    // Error handlers
    app.use(notFound);
    app.use(errorHandler);

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Network accessible on http://${require('ip').address()}:${PORT}`);
    }).on('error', (err) => {
      console.error('🔥 Server failed to start:', err);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("❌ Fatal initialization error:", err);
    process.exit(1);
  }
})();