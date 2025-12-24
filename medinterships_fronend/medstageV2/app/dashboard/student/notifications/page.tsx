"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, X } from "lucide-react"
import { useState } from "react"

export default function StudentNotificationsPage() {
  const initialNotifications = [
    {
      id: 1,
      type: "success",
      title: "Candidature acceptée",
      message: "Votre candidature pour le stage de Cardiologie au CHU Mustapha Bacha a été acceptée.",
      date: "15 Nov 2024",
      isRead: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Profil incomplet",
      message: "N'oubliez pas de télécharger vos documents pour compléter votre profil et pouvoir postuler.",
      date: "12 Nov 2024",
      isRead: false,
    },
    {
      id: 3,
      type: "info",
      title: "Nouveau stage disponible",
      message: "Un nouveau stage en Pédiatrie vient d'être publié au CHU Béni Messous.",
      date: "10 Nov 2024",
      isRead: false,
    },
    {
      id: 4,
      type: "success",
      title: "Évaluation complétée",
      message: "Dr. Hassan a complété votre évaluation pour le stage de Cardiologie.",
      date: "08 Nov 2024",
      isRead: false,
    },
  ]

  const [notifications, setNotifications] = useState(initialNotifications)

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })))
    // ✅ Optionnel : appel API pour sauvegarder côté serveur
    console.log("Toutes les notifications marquées comme lues")
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Notifications</h2>
          <p className="text-muted-foreground">Toutes vos notifications importantes</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          Marquer tout comme lu
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const bgColor =
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-l-green-500 dark:bg-green-900/30 dark:border-l-green-600"
              : "bg-yellow-50 border-l-4 border-l-yellow-500 dark:bg-yellow-900/30 dark:border-l-yellow-600"

          // Style plus discret si lu
          const titleClass = notification.isRead
            ? "font-normal text-muted-foreground"
            : "font-semibold text-foreground"

          return (
            <Card
              key={notification.id}
              className={`p-4 border-border/50 hover:shadow-md transition-all ${bgColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {notification.type === "success" ? (
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 text-green-600 dark:text-green-400"
                    />
                  ) : (
                    <AlertCircle
                      size={20}
                      className="mt-0.5 text-yellow-600 dark:text-yellow-400"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className={titleClass}>{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => markAsRead(notification.id)}
                >
                  <X size={18} />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}