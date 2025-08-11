const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./config/DATABASE");

const otpRoutes = require("./routes/otpRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await initializeDatabase();

    app.use("/api/v1/otp", otpRoutes);
    app.use("/api/v1/suppliers", supplierRoutes);
    app.use("/api/v1/auth", authRoutes);

    app.get("/api/v1/dummy", (req, res) => {
      res.status(200).json({ message: "Dummy API response from backend!" });
    });

    app.use((req, res) => {
      res.status(404).json({ message: "API endpoint not found." });
    });

    app.use((err, req, res, next) => {
      console.error("Global error handler caught:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
})();
