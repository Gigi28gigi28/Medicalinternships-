"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { GraduationCap, Star, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EvaluateStudentPage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [note, setNote] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔁 Extraire l'ID depuis l'URL
  const getStudentId = () => {
    const path = window.location.pathname
    const match = path.match(/\/dashboard\/doctor\/students\/(\d+)\/evaluate/)
    return match ? match[1] : null
  }

  // Charger les données de l'étudiant
  useEffect(() => {
    const id = getStudentId()
    if (!id) {
      alert("Étudiant non trouvé.")
      router.push("/dashboard/doctor/students")
      return
    }

    // 🔁 Données simulées — à remplacer par un appel API
    const mockStudents: Record<string, any> = {
      "1": {
        id: 1,
        name: "Ahmed Mohamed",
        level: "3ème année",
        stage: "Cardiologie",
        matricule: "21234567",
        email: "ahmed@student.com",
      },
      "2": {
        id: 2,
        name: "Fatima Benzahra",
        level: "3ème année",
        stage: "Cardiologie",
        matricule: "21234568",
        email: "fatima@student.com",
      },
      "3": {
        id: 3,
        name: "Karim Berrouak",
        level: "3ème année",
        stage: "Cardiologie",
        matricule: "21234569",
        email: "karim@student.com",
      },
    }

    const data = mockStudents[id]
    if (data) {
      setStudent(data)
    } else {
      alert("Étudiant introuvable.")
      router.push("/dashboard/doctor/students")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const noteNum = parseFloat(note)
    if (isNaN(noteNum) || noteNum < 0 || noteNum > 20) {
      setError("La note doit être un nombre entre 0 et 20.")
      return
    }

    setIsSubmitting(true)

    try {
      // 🔜 À remplacer par un vrai appel API :
      // await fetch(`/api/evaluations`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ student_id: student.id, note: noteNum, comment }),
      // })

      console.log("Évaluation soumise :", { student_id: student.id, note: noteNum, comment })
      alert(`✅ Évaluation de ${student.name} enregistrée avec succès !`)

      // Rediriger vers la liste des étudiants
      router.push("/dashboard/doctor/students")
    } catch (err) {
      console.error("Erreur :", err)
      setError("❌ Échec de l'enregistrement. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Évaluer {student.name}</h2>
        <p className="text-muted-foreground">Saisissez une note et un commentaire pour ce stage</p>
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

      {/* Formulaire d'évaluation */}
      <Card className="p-6 border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-2">
              <Star className="text-yellow-500" size={18} />
              Note sur 20 *
            </Label>
            <div className="relative">
              <Input
                id="note"
                type="number"
                min="0"
                max="20"
                step="0.5"
                placeholder="Ex: 16.5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                className="pr-12"
              />
              <span className="absolute right-3 top-2.5 text-muted-foreground">/20</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (facultatif)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Très bon relationnel avec les patients, à améliorer en gestion du stress..."
              rows={5}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <FileText size={16} />
              {isSubmitting ? "Soumission..." : "Soumettre l'évaluation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}