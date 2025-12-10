"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Clock, X, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)

  const stats = [
    {
      label: "Candidatures en attente",
      value: 3,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Acceptées",
      value: 2,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Refusées",
      value: 1,
      icon: X,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Stages complétés",
      value: 4,
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
    },
  ]

  const recentApplications = [
    {
      id: 1,
      title: "Stage Cardiologie",
      establishment: "CHU Alger",
      date: "2025-01-15",
      status: "pending",
    },
    {
      id: 2,
      title: "Stage Pédiatrie",
      establishment: "Hôpital Ben Aknoun",
      date: "2025-01-10",
      status: "accepted",
    },
    {
      id: 3,
      title: "Stage Urgences",
      establishment: "Clinique Centrale",
      date: "2025-01-05",
      status: "completed",
    },
  ]

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bienvenue, Ahmed</h2>
          <p className="text-muted-foreground mt-1">Tableau de bord de vos stages cliniques</p>
        </div>
        <Link href="/dashboard/student/internships">
          <Button className="bg-primary hover:bg-primary/90">Rechercher un stage</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6 border-border/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Candidatures Récentes</h3>
              <Link href="/dashboard/student/applications">
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{app.title}</h4>
                    <p className="text-sm text-muted-foreground">{app.establishment}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(app.date).toLocaleDateString("fr-FR")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status === "pending" ? "En attente" : app.status === "accepted" ? "Acceptée" : "Complétée"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Profile Completion */}
        <div className="space-y-4">
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Profil</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Complétion</p>
                  <p className="text-sm text-muted-foreground">65%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex gap-2">
                  <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800">Documents manquants</p>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      Téléchargez vos documents pour compléter votre profil
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/dashboard/student/profile" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Compléter mon profil
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
