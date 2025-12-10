"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const stats = [
    { label: "Étudiants à superviser", value: 3, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Évaluations à compléter", value: 2, icon: FileText, color: "bg-orange-50 text-orange-600" },
    { label: "Évaluations soumises", value: 5, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
    { label: "Stages en cours", value: 1, icon: Clock, color: "bg-purple-50 text-purple-600" },
  ]

  const activeStudents = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      stage: "Cardiologie",
      startDate: "01 Déc 2024",
      endDate: "29 Déc 2024",
      progress: 65,
    },
    {
      id: 2,
      name: "Fatima Benzahra",
      stage: "Cardiologie",
      startDate: "15 Déc 2024",
      endDate: "12 Jan 2025",
      progress: 30,
    },
    {
      id: 3,
      name: "Karim Berrouak",
      stage: "Cardiologie",
      startDate: "08 Jan 2025",
      endDate: "05 Fév 2025",
      progress: 0,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Médecin Superviseur</h2>
          <p className="text-muted-foreground mt-1">Suivi et évaluation des étudiants</p>
        </div>
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
        {/* Active Students */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Étudiants Actifs</h3>
              <Link href="/dashboard/doctor/students">
                <Button variant="ghost" size="sm">
                  Voir tous
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {activeStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{student.stage}</p>
                    </div>
                    <Link href={`/dashboard/doctor/students/${student.id}/evaluate`}>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Évaluer
                      </Button>
                    </Link>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Progression du stage</span>
                      <span className="text-xs font-medium text-foreground">{student.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {student.startDate} - {student.endDate}
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
            <Link href="/dashboard/doctor/evaluations" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText size={18} />
                Compléter évaluation
              </Button>
            </Link>
            <Link href="/dashboard/doctor/students" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users size={18} />
                Voir tous les étudiants
              </Button>
            </Link>
            <Link href="/dashboard/doctor/evaluations?status=pending" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Clock size={18} />
                Évaluations en attente
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
