const socketIO = require("socket.io")

let io
const connectedUsers = new Map() // Map to store user socket connections: userId -> socketId

// Initialize Socket.io
const initializeSocket = (httpServer) => {
  io = new socketIO.Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  })

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error("Authentication error"))
    }
    next()
  })

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`)

    // User joins their room
    socket.on("join-user", (userId) => {
      socket.join(`user-${userId}`)
      connectedUsers.set(userId, socket.id)
      console.log(`[Socket] User ${userId} joined room user-${userId}`)

      socket.emit("connection-status", {
        status: "connected",
        message: "Connected to notification service",
      })
    })

    // Listen for role-based rooms
    socket.on("join-role-room", (role) => {
      socket.join(`role-${role}`)
      console.log(`[Socket] Socket joined room role-${role}`)
    })

    // Disconnect handler
    socket.on("disconnect", () => {
      // Find and remove user from connectedUsers
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId)
          break
        }
      }
      console.log(`[Socket] User disconnected: ${socket.id}`)
    })
  })

  return io
}

// Get Socket.io instance
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }
  return io
}

// Emit notification to specific user
const notifyUser = async (userId, notificationData) => {
  try {
    if (!io) {
      console.error("[Notification Error] Socket.io not initialized")
      return
    }

    // Emit to specific user room
    io.to(`user-${userId}`).emit("notification", {
      type: notificationData.type || "info",
      title: notificationData.title,
      message: notificationData.message,
      relatedEntityType: notificationData.relatedEntityType,
      relatedEntityId: notificationData.relatedEntityId,
      timestamp: new Date(),
    })

    console.log(`[Notification] Sent to user ${userId}: ${notificationData.message}`)
  } catch (error) {
    console.error(`[Notification Error] Failed to notify user ${userId}:`, error)
  }
}

// Emit notification to users with specific role
const notifyRole = async (role, notificationData) => {
  try {
    if (!io) {
      console.error("[Notification Error] Socket.io not initialized")
      return
    }

    io.to(`role-${role}`).emit("notification", {
      type: notificationData.type || "info",
      title: notificationData.title,
      message: notificationData.message,
      relatedEntityType: notificationData.relatedEntityType,
      relatedEntityId: notificationData.relatedEntityId,
      timestamp: new Date(),
    })

    console.log(`[Notification] Sent to role ${role}: ${notificationData.message}`)
  } catch (error) {
    console.error(`[Notification Error] Failed to notify role ${role}:`, error)
  }
}

// Broadcast to all connected users
const broadcastNotification = async (notificationData) => {
  try {
    if (!io) {
      console.error("[Notification Error] Socket.io not initialized")
      return
    }

    io.emit("notification", {
      type: notificationData.type || "info",
      title: notificationData.title,
      message: notificationData.message,
      timestamp: new Date(),
    })

    console.log(`[Notification] Broadcast to all: ${notificationData.message}`)
  } catch (error) {
    console.error(`[Notification Error] Failed to broadcast:`, error)
  }
}

module.exports = {
  initializeSocket,
  getIO,
  notifyUser,
  notifyRole,
  broadcastNotification,
  connectedUsers,
}
