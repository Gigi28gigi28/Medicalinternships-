"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  Download,
  Eye,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Types based on your schema
type Internship = {
  id: string
  title: string
  description: string
  departmentId: string
  establishmentId: string
  totalPlaces: number
  filledPlaces: number
  duration: string
  startDate: string
  endDate: string
  requirements: string
  status: 'Actif' | 'Complet' | 'Archivé' | 'Clôturé'
  createdBy: string
  createdAt: string
  updatedAt: string
  establishment?: {
    name: string
    city: string
    type: string
    address: string
  }
  department?: {
    name: string
    description: string
  }
  studentStatus?: 'En cours' | 'Terminé' | 'Annulé' | 'En attente'
  applicationDate?: string
  evaluation?: {
    grade: number
    comment: string
    submittedAt: string
  }
}

export default function InternshipHistoryPage() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Internships history data
  const [internships, setInternships] = useState<Internship[]>([
    {
      id: "1",
      title: "Stage en Cardiologie",
      description: "Stage pratique en service de cardiologie avec suivi des patients, participation aux diagnostics et observations des procédures médicales.",
      departmentId: "dept1",
      establishmentId: "est1",
      totalPlaces: 5,
      filledPlaces: 5,
      duration: "6 semaines",
      startDate: "2024-01-15",
      endDate: "2024-02-26",
      requirements: "Connaissances en cardiologie, bonne communication, aptitude au travail en équipe",
      status: "Archivé",
      createdBy: "chief1",
      createdAt: "2023-12-01",
      updatedAt: "2024-02-26",
      establishment: {
        name: "Centre Hospitalier Universitaire",
        city: "Alger",
        type: "CHU",
        address: "123 Avenue de la Santé, Alger Centre"
      },
      department: {
        name: "Cardiologie",
        description: "Service spécialisé dans les maladies cardiovasculaires"
      },
      studentStatus: "Terminé",
      applicationDate: "2023-12-10",
      evaluation: {
        grade: 16,
        comment: "Excellent travail, très impliqué et curieux. A montré de grandes capacités d'apprentissage.",
        submittedAt: "2024-03-01"
      }
    },
    {
      id: "2",
      title: "Stage en Pédiatrie",
      description: "Stage en service de pédiatrie avec rotation dans différents départements, soins aux enfants et adolescents.",
      departmentId: "dept2",
      establishmentId: "est1",
      totalPlaces: 8,
      filledPlaces: 6,
      duration: "4 semaines",
      startDate: "2024-06-01",
      endDate: "2024-06-29",
      requirements: "Intérêt pour la pédiatrie, patience avec les enfants, sens de l'observation",
      status: "Actif",
      createdBy: "chief1",
      createdAt: "2024-04-15",
      updatedAt: "2024-05-20",
      establishment: {
        name: "Centre Hospitalier Universitaire",
        city: "Alger",
        type: "CHU",
        address: "123 Avenue de la Santé, Alger Centre"
      },
      department: {
        name: "Pédiatrie",
        description: "Service dédié aux soins des enfants et adolescents"
      },
      studentStatus: "En cours",
      applicationDate: "2024-04-20"
    },
    {
      id: "3",
      title: "Stage en Chirurgie Générale",
      description: "Observation et assistance en bloc opératoire, participation aux briefings pré-opératoires.",
      departmentId: "dept3",
      establishmentId: "est2",
      totalPlaces: 3,
      filledPlaces: 3,
      duration: "8 semaines",
      startDate: "2024-09-01",
      endDate: "2024-10-27",
      requirements: "Connaissances en anatomie, capacité à travailler sous pression, rigueur et précision",
      status: "Complet",
      createdBy: "chief2",
      createdAt: "2024-07-01",
      updatedAt: "2024-08-15",
      establishment: {
        name: "Hôpital Général Ben Aknoun",
        city: "Alger",
        type: "Hôpital",
        address: "45 Rue des Frères, Ben Aknoun"
      },
      department: {
        name: "Chirurgie Générale",
        description: "Service de chirurgie générale et d'urgence"
      },
      studentStatus: "En attente",
      applicationDate: "2024-07-10"
    },
    {
      id: "4",
      title: "Stage en Dermatologie",
      description: "Stage en consultation externe de dermatologie, observation des diagnostics et traitements.",
      departmentId: "dept4",
      establishmentId: "est3",
      totalPlaces: 4,
      filledPlaces: 4,
      duration: "5 semaines",
      startDate: "2023-11-01",
      endDate: "2023-12-06",
      requirements: "Intérêt pour la dermatologie, sens de l'observation, discrétion",
      status: "Archivé",
      createdBy: "chief3",
      createdAt: "2023-09-15",
      updatedAt: "2023-12-06",
      establishment: {
        name: "Clinique Médicale Centrale",
        city: "Constantine",
        type: "Clinique",
        address: "78 Boulevard de la République, Constantine"
      },
      department: {
        name: "Dermatologie",
        description: "Service spécialisé dans les maladies de la peau"
      },
      studentStatus: "Terminé",
      applicationDate: "2023-09-25",
      evaluation: {
        grade: 14,
        comment: "Bon travail, assidu et intéressé. A bien progressé durant le stage.",
        submittedAt: "2023-12-15"
      }
    }
  ])

  // Filter internships based on selected status
  const filteredInternships = selectedStatus === "all" 
    ? internships 
    : internships.filter(internship => internship.studentStatus === selectedStatus)

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terminé':
        return "default"
      case 'En cours':
        return "secondary"
      case 'En attente':
        return "outline"
      case 'Annulé':
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé':
        return <CheckCircle size={16} className="text-green-600" />
      case 'En cours':
        return <Clock size={16} className="text-blue-600" />
      case 'En attente':
        return <Clock size={16} className="text-yellow-600" />
      case 'Annulé':
        return <XCircle size={16} className="text-red-600" />
      default:
        return <Clock size={16} />
    }
  }

  // Get unique statuses for filter
  const statuses = ["all", ...new Set(internships.map(i => i.studentStatus))].filter(Boolean) as string[]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/student/profile")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Historique de mes Stages</h2>
            <p className="text-muted-foreground">Consultez l'historique complet de vos stages et évaluations</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{internships.length}</p>
          <p className="text-xs text-muted-foreground">Total stages</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {internships.filter(i => i.studentStatus === 'Terminé').length}
          </p>
          <p className="text-xs text-muted-foreground">Terminés</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {internships.filter(i => i.studentStatus === 'En cours').length}
          </p>
          <p className="text-xs text-muted-foreground">En cours</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {internships.filter(i => i.studentStatus === 'En attente').length}
          </p>
          <p className="text-xs text-muted-foreground">En attente</p>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Filtrer par statut :</span>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="capitalize"
              >
                {status === "all" ? "Tous les statuts" : status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredInternships.length} stage{filteredInternships.length > 1 ? 's' : ''} 
        {selectedStatus !== "all" && ` ${selectedStatus.toLowerCase()}`}
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship) => (
            <Card key={internship.id} className="p-6 border-border/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{internship.title}</h3>
                    <Badge variant={getStatusBadge(internship.studentStatus || '')}>
                      {getStatusIcon(internship.studentStatus || '')}
                      {internship.studentStatus}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">{internship.establishment?.name}</p>
                        <p className="text-xs text-muted-foreground">{internship.establishment?.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{internship.establishment?.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>
                        {new Date(internship.startDate).toLocaleDateString('fr-FR')} - {' '}
                        {new Date(internship.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span>{internship.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service</p>
                  <p className="font-medium text-foreground">{internship.department?.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{internship.department?.description}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date de candidature</p>
                  <p className="font-medium text-foreground">
                    {internship.applicationDate ? 
                      new Date(internship.applicationDate).toLocaleDateString('fr-FR') : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>

              {internship.description && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Description du stage</p>
                  <p className="text-sm text-foreground">{internship.description}</p>
                </div>
              )}

              {internship.evaluation && (
                <div className="mt-4 pt-4 border-t border-border/50 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-green-600" />
                    <p className="text-sm font-medium text-green-800">Évaluation du stage</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-700 mb-1">Note</p>
                      <p className="text-lg font-bold text-green-900">{internship.evaluation.grade}/20</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Commentaire</p>
                      <p className="text-sm text-green-800">{internship.evaluation.comment}</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Évalué le {new Date(internship.evaluation.submittedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-border/50">
            <div className="flex flex-col items-center gap-4">
              <FileText size={64} className="text-muted-foreground" />
              <div>
                <p className="text-muted-foreground font-medium text-lg">Aucun stage trouvé</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedStatus !== "all" 
                    ? `Vous n'avez pas de stages avec le statut "${selectedStatus}"`
                    : "Vous n'avez pas encore de stages dans votre historique"
                  }
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setSelectedStatus("all")}
              >
                Voir tous les stages
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}