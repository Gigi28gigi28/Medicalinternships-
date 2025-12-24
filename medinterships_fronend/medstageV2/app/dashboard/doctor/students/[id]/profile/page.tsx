"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, FileText, Download, Award, Mail, Phone, MapPin, GraduationCap } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function StudentProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // ⚠️ Si vous utilisez un dynamic segment [id], utilisez plutôt :
  // const params = useParams() → mais non disponible en Client Component
  // Donc on va extraire l’ID depuis l’URL
  const getPathId = () => {
    const path = window.location.pathname
    const match = path.match(/\/dashboard\/doctor\/students\/(\d+)\/profile/)
    return match ? match[1] : null
  }

  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = getPathId()
    if (!id) {
      alert("Étudiant non trouvé.")
      router.push("/dashboard/doctor/students")
      return
    }

    // 🔁 Données simulées — à remplacer par un appel API
    const mockStudents: Record<string, any> = {
      "1": {
        id: 1,
        first_name: "Ahmed",
        last_name: "Mohamed",
        email: "ahmed@student.com",
        phone: "+213 55 123 4567",
        level: "3ème année",
        specialty: "Médecine générale",
        city: "Alger",
        matricule: "21234567",
        bio: "Étudiant sérieux, passionné par la cardiologie. Expérience en stage à CHU Béni Messous.",
        stages_completed: 2,
        candidatures: 5,
        evaluations: "2/2",
        documents: [
          { id: "cv1", file_name: "CV_Ahmed.pdf", uploaded_at: "2024-10-10", file_size: 245000 },
          { id: "lm1", file_name: "Lettre_motivation.pdf", uploaded_at: "2024-10-12", file_size: 120000 },
        ],
        profileCompletion: 90,
      },
      "2": {
        id: 2,
        first_name: "Fatima",
        last_name: "Benzahra",
        email: "fatima@student.com",
        phone: "+213 55 234 5678",
        level: "3ème année",
        specialty: "Pédiatrie",
        city: "Alger",
        matricule: "21234568",
        bio: "Étudiante en médecine, intéressée par les soins pédiatriques.",
        stages_completed: 1,
        candidatures: 3,
        evaluations: "1/1",
        documents: [
          { id: "cv2", file_name: "CV_Fatima.pdf", uploaded_at: "2024-11-01", file_size: 198000 },
        ],
        profileCompletion: 75,
      },
      "3": {
        id: 3,
        first_name: "Karim",
        last_name: "Berrouak",
        email: "karim@student.com",
        phone: "+213 55 345 6789",
        level: "3ème année",
        specialty: "Urgences",
        city: "Constantine",
        matricule: "21234569",
        bio: "Passionné par la médecine d'urgence et les situations critiques.",
        stages_completed: 3,
        candidatures: 6,
        evaluations: "3/3",
        documents: [
          { id: "cv3", file_name: "CV_Karim.pdf", uploaded_at: "2024-09-20", file_size: 210000 },
          { id: "att1", file_name: "Attestation_stage_urgence.pdf", uploaded_at: "2024-10-05", file_size: 310000 },
        ],
        profileCompletion: 100,
      },
    }

    const data = mockStudents[id]
    if (data) {
      setStudent(data)
    } else {
      alert("Étudiant introuvable.")
      router.push("/dashboard/doctor/students")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <h2 className="text-3xl font-bold">Chargement du profil...</h2>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Veuillez patienter...</p>
        </Card>
      </div>
    )
  }

  if (!student) return null

  const stats = [
    { label: "Stages complétés", value: student.stages_completed, icon: Award },
    { label: "Candidatures", value: student.candidatures, icon: FileText },
    { label: "Évaluations", value: student.evaluations, icon: Mail },
  ]

  const fullName = `${student.first_name} ${student.last_name}`

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Profil de {fullName}</h2>
        <p className="text-muted-foreground">Informations détaillées de l'étudiant</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-4 border-border/50">
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations personnelles</h3>
            <div className="space-y-3 text-foreground">
              <div className="flex justify-between border-b pb-2 border-border/30">
                <span className="text-muted-foreground">Nom complet</span>
                <span className="font-medium">{fullName}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-border/30">
                <span className="text-muted-foreground">Matricule</span>
                <span className="font-medium">{student.matricule}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-border/30">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-medium">{student.level}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-border/30">
                <span className="text-muted-foreground">Spécialité souhaitée</span>
                <span className="font-medium">{student.specialty}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-border/30">
                <span className="text-muted-foreground">Ville</span>
                <span className="font-medium">{student.city}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">Biographie</h4>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">{student.bio}</p>
            </div>
          </Card>
        </div>

        {/* Avatar + Complétion */}
        <div className="space-y-6">
          <Card className="p-6 border-border/50 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{fullName}</h3>
            <p className="text-sm text-muted-foreground mt-1">{student.level}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground">Complétion</p>
                <p className="text-sm font-bold text-foreground">{student.profileCompletion}%</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${student.profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`mailto:${student.email}`, "_blank")}
                className="gap-1"
              >
                <Mail size={14} />
                Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const tel = student.phone.replace(/\s+/g, "")
                  window.open(`tel:${tel}`, "_blank")
                }}
                className="gap-1"
              >
                <Phone size={14} />
                Appeler
              </Button>
            </div>
          </Card>

          {/* Statut */}
          <Card className="p-4 bg-background border-border/50">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Statut étudiant</p>
                <Badge variant="secondary" className="mt-1">
                  Actif
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Documents */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Documents téléchargés</h3>
        <div className="space-y-4">
          {student.documents.length > 0 ? (
            student.documents.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">{doc.file_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.uploaded_at).toLocaleDateString("fr-FR")} •{" "}
                      {(doc.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/documents/${doc.id}`);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = doc.file_name;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } catch (err) {
                      alert("Erreur lors du téléchargement du document.");
                    }
                  }}
                >
                  <Download size={16} />
                  Télécharger
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">Aucun document disponible.</p>
          )}
        </div>
      </Card>
    </div>
  )
}