const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initializeDatabase } = require("./config/DATABASE");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 3001;

// =======================
//  Security Middlewares
// =======================
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

    // =======================
    //  Route Imports
    // =======================
    const otpRoutes = require("./routes/otpRoutes");
    const authRoutes = require("./routes/authRoutes");
    const supplierRoutes = require("./routes/supplierRoutes");

    // =======================
    //  Routes
    // =======================
    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.status(200).json({ 
        status: "OK", 
        timestamp: new Date(),
        uptime: process.uptime()
      });
    });

    // Test route
    app.get("/said", (req, res) => {
      res.send("Backend server is running!");
    });

    // API routes
    app.use("/api/v1/otp", otpRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/suppliers", supplierRoutes);

    // Dummy API
    app.get("/api/v1/dummy", (req, res) => {
      res.status(200).json({ 
        message: "Dummy API response from backend!",
        timestamp: new Date()
      });
    });

    // =======================
    //  Error Handling
    // =======================
    app.use(notFound);
    app.use(errorHandler);

    // =======================
    //  Start Server
    // =======================
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API endpoints:`);
      console.log(`  ➤ /api/v1/otp/*`);
      console.log(`  ➤ /api/v1/auth/*`);
      console.log(`  ➤ /api/v1/suppliers/*`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
})();