"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, GraduationCap, Clock, Hospital,CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function InternshipDetailPage() {
  const router = useRouter()
  const [internship, setInternship] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🔁 Extraire l'ID depuis l'URL
  const getInternshipId = () => {
    const path = window.location.pathname
    const match = path.match(/\/dashboard\/student\/internships\/(\d+)/)
    return match ? match[1] : null
  }

  useEffect(() => {
    const id = getInternshipId()
    if (!id) {
      alert("Stage non trouvé.")
      router.push("/dashboard/student/internships")
      return
    }

    // 🔜 === OPTION 1 : CHARGER VIA BACKEND (DÉSACTIVÉ POUR L'INSTANT) ===
    /*
    const fetchInternship = async () => {
      try {
        const res = await fetch(`/api/internships/${id}`)
        if (!res.ok) throw new Error("Stage introuvable")
        const data = await res.json()
        setInternship(data)
      } catch (error) {
        console.error("Erreur chargement stage:", error)
        alert("Impossible de charger les détails du stage.")
        router.push("/dashboard/student/internships")
      } finally {
        setLoading(false)
      }
    }
    fetchInternship()
    */

    // ✅ === OPTION 2 : SIMULATION AVEC DONNÉES LOCALES (ACTIF) ===
    const mockData: Record<string, any> = {
      "1": {
        id: 1,
        title: "Stage Cardiologie",
        establishment: "CHU Alger",
        description:
          "Opportunité de stage en cardiologie pour 4ème année. Participation aux consultations, échographies cardiaques, et suivi de patients hospitalisés.",
        department: "Cardiologie",
        duration: 4,
        startDate: "2025-02-01",
        availablePlaces: 3,
        city: "Alger",
        contactEmail: "cardio@chu-alger.dz",
        levels: "4-6ème année",
      },
      "2": {
        id: 2,
        title: "Stage Pédiatrie",
        establishment: "Hôpital Ben Aknoun",
        description:
          "Stage en pédiatrie générale avec suivi individualisé. Observation des consultations, participation aux visites de service, prise en charge basique.",
        department: "Pédiatrie",
        duration: 6,
        startDate: "2025-02-15",
        availablePlaces: 1,
        city: "Alger",
        contactEmail: "pediatrie@benaknoun.dz",
        levels: "3-5ème année",
      },
      "3": {
        id: 3,
        title: "Stage Urgences",
        establishment: "Clinique Centrale Constantine",
        description:
          "Service des urgences polyvalent, excellente formation pratique. Rotation entre les différents postes : triage, box d'urgence, surveillance.",
        department: "Urgences",
        duration: 4,
        startDate: "2025-03-01",
        availablePlaces: 5,
        city: "Constantine",
        contactEmail: "urgences@clinique-constantine.dz",
        levels: "4-6ème année",
      },
    }

    const data = mockData[id]
    if (data) {
      setInternship(data)
    } else {
      alert("Stage non trouvé.")
      router.push("/dashboard/student/internships")
    }
    setLoading(false)
  }, [router])

  const handleApply = () => {
    if (!internship) return
    if (confirm(`Voulez-vous vraiment postuler à "${internship.title}" ?`)) {
      // 🔜 === OPTION : ENVOYER LA CANDIDATURE AU BACKEND ===
      /*
      fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId: internship.id }),
      })
        .then((res) => {
          if (res.ok) {
            alert("✅ Candidature envoyée avec succès !")
            router.push("/dashboard/student/applications")
          } else {
            throw new Error("Échec de la postulation")
          }
        })
        .catch(() => {
          alert("❌ Erreur lors de la postulation. Veuillez réessayer.")
        })
      */

      // ✅ === SIMULATION ===
      alert(`✅ Votre candidature pour "${internship.title}" a été soumise !`)
      router.push("/dashboard/student/applications")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Chargement du stage...</p>
        </Card>
      </div>
    )
  }

  if (!internship) return null

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">{internship.title}</h2>
        <p className="text-muted-foreground">Détails de l'offre de stage</p>
      </div>

      <Card className="p-6 border-border/50">
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">{internship.establishment}</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">{internship.city}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {internship.availablePlaces} place{internship.availablePlaces !== 1 ? "s" : ""} disponible
              {internship.availablePlaces !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Description</h4>
            <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">{internship.description}</p>
          </div>

          {/* Informations clés */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-primary mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">Date de début</p>
                  <p className="font-medium text-foreground">
                    {new Date(internship.startDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">Durée</p>
                  <p className="font-medium text-foreground">{internship.duration} semaines</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="text-primary mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">Niveaux acceptés</p>
                  <p className="font-medium text-foreground">{internship.levels}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hospital className="text-primary mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">Département</p>
                  <p className="font-medium text-primary">{internship.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de postulation */}
          <div className="pt-4 border-t border-border/50 flex gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground gap-2"
              onClick={handleApply}
            >
              <CheckCircle size={18} />
              Postuler à ce stage
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Retour
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}