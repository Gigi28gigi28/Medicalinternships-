require("dotenv").config()
const app = require("./app")
const sequelize = require("./config/database")
const http = require("http")
const { initializeSocket } = require("./socket/socket")

// Load all models
require("./models/models")

const PORT = process.env.PORT || 5000
;(async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ MySQL connected")

    const httpServer = http.createServer(app)

    initializeSocket(httpServer)

    // Start server with Socket.io
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 WebSocket server initialized`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (err) {
    console.error("❌ Database connection failed:", err)
    process.exit(1)
  }
})()