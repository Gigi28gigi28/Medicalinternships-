"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { GraduationCap, Star, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ViewEvaluationPage() {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🔁 Extraire l'ID depuis l'URL (pour /dashboard/doctor/evaluations/2/viewEvaluation)
  const getEvaluationId = () => {
    const path = window.location.pathname
    const match = path.match(/\/dashboard\/doctor\/evaluations\/(\d+)\/viewEvaluation/)
    return match ? match[1] : null
  }

  useEffect(() => {
    const id = getEvaluationId()
    if (!id) {
      alert("Évaluation non trouvée.")
      router.push("/dashboard/doctor/evaluations")
      return
    }

    // 🔁 Données simulées — à remplacer par un appel à /api/evaluations/[id]
    const mockEvaluations: Record<string, any> = {
      "1": {
        id: 1,
        student: {
          name: "Ahmed Mohamed",
          level: "3ème année",
          stage: "Cardiologie",
          matricule: "21234567",
        },
        note: 18.5,
        comment: "Excellent travail, grande rigueur et bon relationnel. À encourager pour la spécialisation en cardiologie.",
        submittedAt: "25 Nov 2024",
      },
      "2": {
        id: 2,
        student: {
          name: "Fatima Benzahra",
          level: "3ème année",
          stage: "Cardiologie",
          matricule: "21234568",
        },
        note: 16,
        comment: "Bonnes compétences cliniques, mais à améliorer en gestion du stress lors des urgences.",
        submittedAt: "20 Nov 2024",
      },
      "3": {
        id: 3,
        student: {
          name: "Karim Berrouak",
          level: "3ème année",
          stage: "Cardiologie",
          matricule: "21234569",
        },
        note: 19,
        comment: "Étudiant remarquable, proactif et très à l'aise avec les patients. Potentiel exceptionnel.",
        submittedAt: "18 Nov 2024",
      },
    }

    const data = mockEvaluations[id]
    if (data) {
      setEvaluation(data)
    } else {
      alert("Évaluation introuvable.")
      router.push("/dashboard/doctor/evaluations")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Chargement de l'évaluation...</p>
        </Card>
      </div>
    )
  }

  if (!evaluation) return null

  const student = evaluation.student

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Évaluation de {student.name}</h2>
        <p className="text-muted-foreground">Consultation de l'évaluation soumise</p>
      </div>

      {/* Informations de l'étudiant */}
      <Card className="p-6 border-border/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
            <p className="text-sm text-muted-foreground">
              {student.level} • {student.stage}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Matricule : {student.matricule}</p>
          </div>
        </div>
      </Card>

      {/* Contenu de l'évaluation (lecture seule) */}
      <Card className="p-6 border-border/50">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Star className="text-yellow-500" size={18} />
              Note finale
            </Label>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">{evaluation.note}</span>
              <span className="text-muted-foreground">/20</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Soumise le {new Date(evaluation.submittedAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Commentaire du médecin</Label>
            <div className="min-h-[100px] p-3 bg-muted/30 rounded-md border border-border/30">
              {evaluation.comment || "Aucun commentaire fourni."}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => window.print()}
              className="bg-muted hover:bg-muted/80 gap-2"
            >
              <FileText size={16} />
              Imprimer
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              Retour
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}