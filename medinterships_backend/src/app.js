const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const studentRoutes = require("./routes/students")
const doctorRoutes = require("./routes/doctors")
const serviceChiefRoutes = require("./routes/service-chiefs")
const deanRoutes = require("./routes/dean")
const internshipRoutes = require("./routes/internships")
const establishmentRoutes = require("./routes/establishments")
const serviceRoutes = require("./routes/services")
const notificationRoutes = require("./routes/notifications")

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/students", studentRoutes)
app.use("/api/v1/doctors", doctorRoutes)
app.use("/api/v1/service-chiefs", serviceChiefRoutes)
app.use("/api/v1/dean", deanRoutes)
app.use("/api/v1/internships", internshipRoutes)
app.use("/api/v1/establishments", establishmentRoutes)
app.use("/api/v1/services", serviceRoutes)
app.use("/api/v1/notifications", notificationRoutes) // Added notification routes

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

app.all(/.*/, (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err)

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ status: "error", message: "Invalid data", errors: err.errors.map((e) => e.message) })
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res
      .status(400)
      .json({ status: "error", message: `Duplicate value for: ${Object.keys(err.fields).join(", ")}` })
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({ status: "error", message: "Invalid reference. Foreign key constraint failed." })
  }

  if (err.name === "JsonWebTokenError") return res.status(401).json({ status: "error", message: "Invalid token" })
  if (err.name === "TokenExpiredError") return res.status(401).json({ status: "error", message: "Token expired" })

  res.status(err.statusCode || 500).json({ status: "error", message: err.message || "Internal server error" })
})

// Unhandled error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    status: "error",
    message: "Server error",
    error: err.message,
  })
})

module.exports = app
