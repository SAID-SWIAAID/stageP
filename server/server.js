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
    const userRoutes = require("./routes/userRoutes");
    const completeProfileRoutes = require("./routes/completeProfileRoutes");
    const categoryRoutes = require("./routes/categoryRoutes");

    const createBoutiqueRoutes = require("./routes/createBoutiqueRoutes");
    const getSupplierBoutiquesRoutes = require("./routes/getSupplierBoutiquesRoutes");
    const authRoutes = require("./routes/authRoutes");
    const createProductRoute = require("./routes/createProductRoute");
    const getProductsRoute = require("./routes/getProductsRoute");
    const updateProductRoute = require("./routes/updateProductRoute");
    const deleteProductRoute = require("./routes/deleteProductRoute");
    const supplierRoutes = require("./routes/supplierRoutes");

    // Test route
    app.get("/said", (req, res) => {
      res.send("Backend server is running!");
    });

    // API routes
    app.use("/api/v1/otp", otpRoutes);
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/users", completeProfileRoutes);
    app.use("/api/v1/categories", categoryRoutes);
    app.use("/api/v1/auth", authRoutes);

    app.use("/api/boutiques", createBoutiqueRoutes);
    app.use("/api/boutiques", getSupplierBoutiquesRoutes);

    app.use("/api/products", createProductRoute);
    app.use("/api/products", getProductsRoute);
    app.use("/api/products", updateProductRoute);
    app.use("/api/products", deleteProductRoute);

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