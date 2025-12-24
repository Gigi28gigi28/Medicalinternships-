const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notificationController")
const { protect } = require('../middleware/auth');

router.use(protect);

// Get all notifications
router.get("/", notificationController.getNotifications)

// Mark as read
router.post("/:id/read", notificationController.markAsRead)

// Delete notification
router.delete("/:id", notificationController.deleteNotification)

module.exports = router
