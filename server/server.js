const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { initializeDatabase } = require("./config/DATABASE");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 3000; // Set to 3000 as requested
const path = process.env.API_BASE_PATH || '/api/v1';
// =======================
//  Security Middlewares
// =======================
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'] // Important for JWT tokens
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
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
    const authRoutes = require("./routes/authRoutes");
    const supplierRoutes = require("./routes/supplierRoutes");

    // Setup routes
    app.get("/api/health", (req, res) => res.json({ status: "OK" }));
    app.get("/said", (req, res) => res.send("Backend server is running!"));
 app.use(`${path}/auth`, authRoutes);
    app.use(`${path}/suppliers/profile`, supplierRoutes);


    // Error handlers
    app.use(notFound);
    app.use(errorHandler);

    // Start server with error handling
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