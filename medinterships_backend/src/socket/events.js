const { getIO, connectedUsers } = require("./socket")
const NotificationService = require("../service/notificationService")

// Define all socket events
const socketEvents = {
  // Internship events
  APPLICATION_SUBMITTED: "application:submitted",
  APPLICATION_UPDATED: "application:updated",
  APPLICATION_ACCEPTED: "application:accepted",
  APPLICATION_REJECTED: "application:rejected",

  // Internship events
  INTERNSHIP_CREATED: "internship:created",
  INTERNSHIP_UPDATED: "internship:updated",
  INTERNSHIP_CLOSED: "internship:closed",

  // Evaluation events
  EVALUATION_CREATED: "evaluation:created",
  EVALUATION_SUBMITTED: "evaluation:submitted",
  EVALUATION_GRADED: "evaluation:graded",

  // User events
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",

  // General
  NOTIFICATION: "notification",
  ERROR: "error",
}

// Socket event handlers
const setupSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`[Events] Connection established: ${socket.id}`)

    // Application submitted event
    socket.on(socketEvents.APPLICATION_SUBMITTED, async (data) => {
      try {
        console.log(`[Event] Application submitted:`, data)
        // Broadcast to service chiefs and dean
        io.to("role-service_chief").emit(socketEvents.APPLICATION_SUBMITTED, data)
        io.to("role-dean").emit(socketEvents.APPLICATION_SUBMITTED, data)
      } catch (error) {
        console.error("[Event Error]", error)
        socket.emit(socketEvents.ERROR, { message: error.message })
      }
    })

    // Application status updated event
    socket.on(socketEvents.APPLICATION_UPDATED, async (data) => {
      try {
        console.log(`[Event] Application updated:`, data)
        io.to(`user-${data.studentId}`).emit(socketEvents.APPLICATION_UPDATED, data)
      } catch (error) {
        console.error("[Event Error]", error)
        socket.emit(socketEvents.ERROR, { message: error.message })
      }
    })

    // Internship created event
    socket.on(socketEvents.INTERNSHIP_CREATED, async (data) => {
      try {
        console.log(`[Event] Internship created:`, data)
        io.to("role-student").emit(socketEvents.INTERNSHIP_CREATED, data)
      } catch (error) {
        console.error("[Event Error]", error)
        socket.emit(socketEvents.ERROR, { message: error.message })
      }
    })

    // Internship updated event
    socket.on(socketEvents.INTERNSHIP_UPDATED, async (data) => {
      try {
        console.log(`[Event] Internship updated:`, data)
        io.to("role-student").emit(socketEvents.INTERNSHIP_UPDATED, data)
      } catch (error) {
        console.error("[Event Error]", error)
        socket.emit(socketEvents.ERROR, { message: error.message })
      }
    })

    // Evaluation created event
    socket.on(socketEvents.EVALUATION_CREATED, async (data) => {
      try {
        console.log(`[Event] Evaluation created:`, data)
        io.to(`user-${data.studentId}`).emit(socketEvents.EVALUATION_CREATED, data)
      } catch (error) {
        console.error("[Event Error]", error)
        socket.emit(socketEvents.ERROR, { message: error.message })
      }
    })

    // Evaluation submitted event
    socket.on(socketEvents.EVALUATION_SUBMITTED, async (data) => {
      try {
        console.log(`[Event] Evaluation submitted:`, data)
        io.to(`user-${data.doctorId}`).emit(socketEvents.EVALUATION_SUBMITTED, data)
      } catch (error) {
        console.error("[Event Error]", error)
        socket.emit(socketEvents.ERROR, { message: error.message })
      }
    })

    // User online event
    socket.on(socketEvents.USER_ONLINE, (userId) => {
      try {
        console.log(`[Event] User online: ${userId}`)
        io.emit(socketEvents.USER_ONLINE, { userId, socketId: socket.id })
      } catch (error) {
        console.error("[Event Error]", error)
      }
    })

    socket.on("disconnect", () => {
      console.log(`[Events] Disconnected: ${socket.id}`)
      io.emit(socketEvents.USER_OFFLINE, { socketId: socket.id })
    })
  })
}

module.exports = {
  socketEvents,
  setupSocketEvents,
}
