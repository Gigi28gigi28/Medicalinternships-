"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DoctorEvaluationsPage() {
  const [filterStatus, setFilterStatus] = useState("pending")

  const evaluations = [
    {
      id: 1,
      student: "Ahmed Mohamed",
      stage: "Cardiologie",
      status: "En attente",
      dueDate: "05 Jan 2025",
      daysLeft: 15,
    },
    {
      id: 2,
      student: "Fatima Benzahra",
      stage: "Cardiologie",
      status: "En attente",
      dueDate: "20 Jan 2025",
      daysLeft: 30,
    },
    {
      id: 3,
      student: "Karim Berrouak",
      stage: "Cardiologie",
      status: "Soumise",
      dueDate: "12 Fév 2025",
      daysLeft: 53,
    },
  ]
   // Filtrage des évaluations basé sur filterStatus
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (filterStatus === "pending" && evaluation.status === "En attente") return true
    if (filterStatus === "submitted" && evaluation.status === "Soumise") return true
    return false
  })

  return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Mes Évaluations</h2>
            <p className="text-muted-foreground">Remplissez et soumettez les évaluations des étudiants</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["pending", "submitted"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "bg-primary hover:bg-primary/90" : ""}
            >
              {status === "pending" ? "En attente" : "Soumises"}
            </Button>
          ))}
        </div>

        {/* Evaluations List */}
        <div className="space-y-4">
          {filteredEvaluations.map((evaluation) => (
            <Card
              key={evaluation.id}
              className={`p-6 border-border/50 hover:shadow-md transition-all ${
                evaluation.status === "En attente" ? "border-l-4 border-l-yellow-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{evaluation.student}</h3>
                  <p className="text-muted-foreground text-sm">{evaluation.stage}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
                    evaluation.status === "En attente" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {evaluation.status === "En attente" ? (
                    <>
                      <Clock size={14} />
                      En attente
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      Soumise
                    </>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Échéance</p>
                  <p className="font-medium text-foreground">{evaluation.dueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Jours restants</p>
                  <p className={`font-medium ${evaluation.daysLeft <= 7 ? "text-destructive" : "text-foreground"}`}>
                    {evaluation.daysLeft} jours
                  </p>
                </div>
              </div>

              {evaluation.status === "En attente" && (
                <Link href={`/dashboard/doctor/students/${evaluation.id}/evaluate`}>
                  <Button className="bg-primary hover:bg-primary/90">
                    <FileText size={16} />
                    Remplir l'évaluation
                  </Button>
                </Link>
              )}
              {evaluation.status === "Soumise" && (
                <Link href={`/dashboard/doctor/evaluations/${evaluation.id}/viewEvaluation`}>
                  <Button variant="outline">
                    <FileText size={16} />
                    Voir l'évaluation
                  </Button>
                </Link>  
              )}
            </Card>
          ))}
        </div>
      </div>
  )
}
