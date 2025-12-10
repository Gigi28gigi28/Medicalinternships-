"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Users, Calendar, Plus, Lock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useInternships } from "@/hooks/use-backend-api"

export default function ChiefInternshipsPage() {
  const [loading, setLoading] = useState(true)
  const { data: internships } = useInternships()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setLoading(false)
    }
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Mes Offres de Stage</h2>
            <p className="text-muted-foreground">Créez, modifiez et clôturez vos offres</p>
          </div>
          <Link href="/dashboard/chief/internships/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={20} />
              Nouveau stage
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {internships && internships.length > 0 ? (
            internships.map((internship) => (
              <Card key={internship.id} className="p-6 border-border/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{internship.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{internship.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/chief/internships/${internship.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit2 size={16} />
                        Modifier
                      </Button>
                    </Link>
                    {internship.status === "active" && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Lock size={16} />
                        Clôturer
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Places</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${((internship.filled_places || 0) / internship.available_places) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {internship.filled_places || 0}/{internship.available_places}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Candidats</p>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      <span className="font-medium text-foreground">{internship.applicants_count || 0}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Période</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span className="text-sm text-foreground">
                        {new Date(internship.start_date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Statut</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        internship.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {internship.status === "active" ? "Actif" : "Fermé"}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center border-border/50">
              <p className="text-muted-foreground">Aucun stage trouvé</p>
            </Card>
          )}
        </div>
      </div>
  )
}
