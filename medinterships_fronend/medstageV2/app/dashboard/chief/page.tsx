"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, CheckCircle2, BarChart3, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ChiefDashboard() {
  const [urgentApplications, setUrgentApplications] = useState([
    {
      id: 1,
      studentName: "Ahmed Mohamed",
      internshipTitle: "Stage Cardiologie",
      appliedDate: "2025-01-05",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Fatima Benzahra",
      internshipTitle: "Stage Pédiatrie",
      appliedDate: "2025-01-08",
      status: "pending",
    },
  ])

  const stats = [
    {
      label: "Candidatures en attente",
      value: urgentApplications.filter(app => app.status === "pending").length,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      trend: "+2 aujourd'hui",
    },
    {
      label: "Étudiants en stage",
      value: 12,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      trend: "En cours",
    },
    {
      label: "Offres publiées",
      value: 8,
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      trend: "Actives",
    },
    {
      label: "Évaluations à valider",
      value: 3,
      icon: BarChart3,
      color: "bg-purple-50 text-purple-600",
      trend: "Urgentes",
    },
  ]

  const activeInternships = [
    {
      id: 1,
      title: "Stage Cardiologie",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      filledPlaces: 3,
      availablePlaces: 5,
    },
    {
      id: 2,
      title: "Stage Pédiatrie",
      startDate: "2025-01-20",
      endDate: "2025-02-20",
      filledPlaces: 2,
      availablePlaces: 4,
    },
  ]

  // ✅ Gérer l'acceptation
  const handleAccept = (id: number) => {
    setUrgentApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: "accepted" } : app
      )
    )
    // 🔜 À remplacer par un appel API :
    // fetch(`/api/applications/${id}/accept`, { method: "POST" })
    alert("✅ Candidature acceptée avec succès !")
  }

  // ✅ Gérer le refus
  const handleReject = (id: number) => {
    setUrgentApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: "rejected" } : app
      )
    )
    // 🔜 À remplacer par un appel API :
    // fetch(`/api/applications/${id}/reject`, { method: "POST" })
    alert("❌ Candidature refusée.")
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Chef de Service</h2>
          <p className="text-muted-foreground mt-1">Gestion des stages et candidatures</p>
        </div>
        <Link href="/dashboard/chief/internships/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={20} />
            Publier un stage
          </Button>
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
                  <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
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
        {/* Urgent Applications */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-yellow-600" />
                <h3 className="text-lg font-semibold text-foreground">Candidatures Urgentes (7+ jours)</h3>
              </div>
              <Link href="/dashboard/chief/applications">
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {urgentApplications
                .filter(app => app.status === "pending")
                .map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{app.studentName}</h4>
                        <p className="text-sm text-muted-foreground">{app.internshipTitle}</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Candidature depuis le {new Date(app.appliedDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleAccept(app.id)}
                        >
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(app.id)}
                        >
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              {urgentApplications.filter(app => app.status === "pending").length === 0 && (
                <p className="text-muted-foreground text-center py-4">Aucune candidature en attente.</p>
              )}
            </div>
          </Card>

          {/* Active Internships */}
          <Card className="p-6 border-border/50 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Stages Actifs</h3>
              <Link href="/dashboard/chief/internships">
                <Button variant="ghost" size="sm">
                  Gérer
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {activeInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{internship.title}</h4>
                    <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                      {internship.filledPlaces}/{internship.availablePlaces} places
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(internship.startDate).toLocaleDateString("fr-FR")} -{" "}
                    {new Date(internship.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 border-border/50 h-fit">
          <h3 className="text-lg font-semibold text-foreground mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Link href="/dashboard/chief/internships/new" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus size={18} />
                Nouveau stage
              </Button>
            </Link>
            <Link href="/dashboard/chief/applications" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertCircle size={18} />
                Gérer candidatures
              </Button>
            </Link>
            <Link href="/dashboard/chief/evaluations" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 size={18} />
                Valider évaluations
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}