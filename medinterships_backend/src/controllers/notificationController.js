const NotificationService = require("../service/notificationService")

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id)
    res.status(200).json({ status: "success", data: { notifications } })
  } catch (error) {
    console.error("doctor dashboard error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    await NotificationService.markAsRead(req.user.id, id)
    res.status(200).json({ status: "success", message: "Notification marquée comme lue" })
  } catch (error) {
        console.error("doctor dashboard error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params
    await NotificationService.deleteNotification(req.user.id, id)
    res.status(200).json({ status: "success", message: "Notification supprimée" })
  } catch (error) {
    console.error("Delete notification error:", error)
    res.status(500).json({ status: "error", message: "Erreur lors de la suppression de la notification" })
  }
}
