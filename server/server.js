const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./config/DATABASE");

const app = express();
const PORT = process.env.PORT || 3001;

// =======================
//  Middlewares
// =======================
app.use(cors());
app.use(express.json());

// =======================
//  Start after DB Init
// =======================
(async () => {
  try {
    await initializeDatabase();
    console.log("✅ Database initialized successfully");

    // Routes
    const otpRoutes = require("./routes/otpRoutes");
    const authRoutes = require("./routes/authRoutes");
    const supplierRoutes = require("./routes/supplierRoutes");

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
      res.status(200).json({ message: "Dummy API response from backend!" });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: "API endpoint not found." });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error("Global error handler caught:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
})();

// =======================
//  Start Server
// =======================
/*app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`  ➤ /api/otp/*`);
  console.log(`  ➤ /api/users/*`);
  console.log(`  ➤ /api/categories/*`);
  console.log(`  ➤ /api/boutiques/*`);
  console.log(`  ➤ /api/products/*`);
  console.log(`  ➤ /api/clients/*`);
  console.log(`  ➤ /api/suppliers/*`);
});
*/