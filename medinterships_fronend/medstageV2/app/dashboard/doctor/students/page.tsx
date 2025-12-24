"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Mail, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorStudentsPage() {
  const router = useRouter()

  const students = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      matricule: "21234567",
      level: "3ème année",
      stage: "Cardiologie",
      email: "ahmed@student.com",
      phone: "+213 55 123 4567",
      startDate: "01 Déc 2024",
      evaluated: false,
    },
    {
      id: 2,
      name: "Fatima Benzahra",
      matricule: "21234568",
      level: "3ème année",
      stage: "Cardiologie",
      email: "fatima@student.com",
      phone: "+213 55 234 5678",
      startDate: "15 Déc 2024",
      evaluated: false,
    },
    {
      id: 3,
      name: "Karim Berrouak",
      matricule: "21234569",
      level: "3ème année",
      stage: "Cardiologie",
      email: "karim@student.com",
      phone: "+213 55 345 6789",
      startDate: "08 Jan 2025",
      evaluated: true,
    },
  ]

  // ✅ Contacter par email
  const handleContact = (email: string) => {
    window.open(`mailto:${email}`, "_blank")
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mes Étudiants</h2>
        <p className="text-muted-foreground">Consultez les informations de vos étudiants</p>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <Card
            key={student.id}
            className="p-6 border-border/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap size={24} className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {student.matricule} • {student.level}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  student.evaluated
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {student.evaluated ? "✓ Évalué" : "À évaluer"}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Stage</p>
                <p className="font-medium text-foreground">{student.stage}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Début du stage</p>
                <p className="font-medium text-foreground">{student.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contact</p>
                <p className="font-medium text-foreground">{student.phone}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* 👁️ Voir profil */}
              <Link href={`/dashboard/doctor/students/${student.id}/profile`} passHref>
                <Button size="sm" variant="outline">
                  <Eye size={16} className="mr-1" />
                  Voir profil
                </Button>
              </Link>

              {/* 📝 Évaluer / Modifier */}
              <Link href={`/dashboard/doctor/students/${student.id}/evaluate`} passHref>
                <Button
                  size="sm"
                  className={
                    student.evaluated
                      ? "bg-muted hover:bg-muted/80 text-foreground"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }
                >
                  <FileText size={16} className="mr-1" />
                  {student.evaluated ? "Modifier évaluation" : "Évaluer"}
                </Button>
              </Link>

              {/* 📧 Contacter */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContact(student.email)}
                aria-label={`Contacter ${student.name} par email`}
              >
                <Mail size={16} className="mr-1" />
                Contacter
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}