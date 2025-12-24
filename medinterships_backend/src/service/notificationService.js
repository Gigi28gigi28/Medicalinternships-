const { Notification, User } = require("../models/models")
const { notifyUser, notifyRole } = require("../socket/socket")

class NotificationService {
  // Create and send notification to a specific user
  static async sendToUser(userId, notificationData) {
    try {
      const notification = await Notification.create({
        userId,
        type: notificationData.type || "info",
        title: notificationData.title,
        message: notificationData.message,
        relatedEntityType: notificationData.relatedEntityType,
        relatedEntityId: notificationData.relatedEntityId,
      })

      await notifyUser(userId, notificationData)
      return notification
    } catch (error) {
      console.error("[NotificationService] Error sending to user:", error)
      throw error
    }
  }

  // Create and send notification to multiple users
  static async sendToMultipleUsers(userIds, notificationData) {
    try {
      const notifications = []
      for (const userId of userIds) {
        const notification = await Notification.create({
          userId,
          type: notificationData.type || "info",
          title: notificationData.title,
          message: notificationData.message,
          relatedEntityType: notificationData.relatedEntityType,
          relatedEntityId: notificationData.relatedEntityId,
        })
        notifications.push(notification)
        await notifyUser(userId, notificationData)
      }
      return notifications
    } catch (error) {
      console.error("[NotificationService] Error sending to multiple users:", error)
      throw error
    }
  }

  // Send notification to users by role
  static async sendToRole(role, notificationData) {
    try {
      const users = await User.findAll({ where: { role } })
      const userIds = users.map((u) => u.id)

      for (const userId of userIds) {
        await Notification.create({
          userId,
          type: notificationData.type || "info",
          title: notificationData.title,
          message: notificationData.message,
          relatedEntityType: notificationData.relatedEntityType,
          relatedEntityId: notificationData.relatedEntityId,
        })
      }

      await notifyRole(role, notificationData)
      return { success: true, userCount: userIds.length }
    } catch (error) {
      console.error("[NotificationService] Error sending to role:", error)
      throw error
    }
  }

  // Application status update notification
  static async notifyApplicationUpdate(studentId, applicationId, newStatus) {
    const statusMessages = {
      acceptee: "Votre candidature a été acceptée!",
      refusee: "Votre candidature a été refusée.",
      en_attente: "Votre candidature est en attente de traitement.",
    }

    return this.sendToUser(studentId, {
      type: newStatus === "acceptee" ? "success" : newStatus === "refusee" ? "error" : "info",
      title: "Mise à jour de candidature",
      message: statusMessages[newStatus] || "Votre candidature a été mise à jour.",
      relatedEntityType: "Application",
      relatedEntityId: applicationId,
    })
  }

  // Internship status update notification
  static async notifyInternshipUpdate(internshipId, statusMessage) {
    return this.sendToRole("student", {
      type: "info",
      title: "Mise à jour de stage",
      message: statusMessage,
      relatedEntityType: "Internship",
      relatedEntityId: internshipId,
    })
  }

  // Evaluation reminder notification
  static async notifyEvaluationReminder(studentId, evaluationId) {
    return this.sendToUser(studentId, {
      type: "warning",
      title: "Rappel d'évaluation",
      message: "Une évaluation vous attend. Veuillez la soumettre dans les délais.",
      relatedEntityType: "Evaluation",
      relatedEntityId: evaluationId,
    })
  }

  // Get user notifications
  static async getUserNotifications(userId, limit = 50, offset = 0) {
    try {
      const notifications = await Notification.findAndCountAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      })
      return notifications
    } catch (error) {
      console.error("[NotificationService] Error fetching notifications:", error)
      throw error
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId },
      })

      if (!notification) {
        throw new Error("Notification not found")
      }

      notification.isRead = true
      notification.readAt = new Date()
      await notification.save()

      return notification
    } catch (error) {
      console.error("[NotificationService] Error marking as read:", error)
      throw error
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      await Notification.update({ isRead: true, readAt: new Date() }, { where: { userId, isRead: false } })
      return { success: true }
    } catch (error) {
      console.error("[NotificationService] Error marking all as read:", error)
      throw error
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: { userId, isRead: false },
      })
      return count
    } catch (error) {
      console.error("[NotificationService] Error getting unread count:", error)
      throw error
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const result = await Notification.destroy({
        where: { id: notificationId, userId },
      })
      return { success: result > 0 }
    } catch (error) {
      console.error("[NotificationService] Error deleting notification:", error)
      throw error
    }
  }
}

module.exports = NotificationService
