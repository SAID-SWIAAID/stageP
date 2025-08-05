const express = require("express")
const cors = require("cors")
require("dotenv").config()

// Import database configuration
const { initializeDatabase } = require('./config/DATABASE.JS')

// Import routes
const otpRoutes = require('./routes/otpRoutes')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const boutiqueRoutes = require('./routes/boutiqueRoutes')
const productRoutes = require('./routes/productRoutes')
const clientRoutes = require('./routes/clientRoutes')
const supplierRoutes = require('./routes/supplierRoutes')

// Import middleware
const upload = require('./middleware/uploadMiddleware')

const app = express()
const PORT = process.env.PORT || 3001

// Initialize database
initializeDatabase()

// Middleware
app.use(cors())
app.use(express.json())

// Root route
app.get("/", (req, res) => {
  res.send("Backend server is running!")
})

// API Routes
app.use("/api/otp", otpRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/boutiques", boutiqueRoutes)
app.use("/api/products", productRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/suppliers", supplierRoutes)

// Dummy API endpoint for testing
app.get("/api/dummy", (req, res) => {
  res.status(200).json({ message: "This is a dummy API response from the backend!" })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API endpoints available:`)
  console.log(`  OTP: /api/otp/*`)
  console.log(`  Users: /api/users/*`)
  console.log(`  Categories: /api/categories`)
  console.log(`  Boutiques: /api/boutiques/*`)
  console.log(`  Products: /api/products/*`)
  console.log(`  Clients: /api/clients/*`)
  console.log(`  Suppliers: /api/suppliers/*`)
})