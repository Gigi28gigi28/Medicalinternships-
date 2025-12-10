"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, FileText, User, Eye } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

export default function ChiefApplicationsPage() {
  // Statuts internes en anglais pour la logique, traduits à l'affichage
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "accepted": return "Acceptée"
      case "rejected": return "Refusée"
      default: return "Inconnu"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "accepted": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return ""
    }
  }

  const [filterStatus, setFilterStatus] = useState("all")
  
  // Données simulées — à remplacer par un appel API en production
  const [applications, setApplications] = useState([
    {
      id: 1,
      student: "Ahmed Mohamed",
      stage: "Cardiologie",
      status: "pending",
      appliedDate: "15 Nov 2024",
      email: "ahmed@student.com",
      level: "3ème année",
    },
    {
      id: 2,
      student: "Fatima Benzahra",
      stage: "Pédiatrie",
      status: "pending",
      appliedDate: "12 Nov 2024",
      email: "fatima@student.com",
      level: "3ème année",
    },
    {
      id: 3,
      student: "Karim Berrouak",
      stage: "Cardiologie",
      status: "accepted",
      appliedDate: "10 Nov 2024",
      email: "karim@student.com",
      level: "3ème année",
    },
  ])

  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [documents, setDocuments] = useState<{ name: string; url: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Récupérer les documents avec gestion d’annulation
  useEffect(() => {
    if (!selectedApplication) return

    const controller = new AbortController()
    setIsLoading(true)
    setDocuments([])

    fetch(`/api/applications/${selectedApplication.id}/documents`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau")
        return res.json()
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setDocuments(Array.isArray(data) ? data : [])
          setIsLoading(false)
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Erreur lors du chargement des documents:", error)
          setDocuments([])
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [selectedApplication])

  const handleAccept = async (id: number) => {
  // Optimistic update (mise à jour immédiate de l’UI)
  setApplications(prev =>
    prev.map(app => app.id === id ? { ...app, status: "accepted" } : app)
  )

  try {
    // Appel au backend
    await fetch(`/api/applications/${id}/accept`, {
      method: "POST",
    })
  } catch (error) {
    // En cas d’erreur, rollback
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status: "pending" } : app)
    )
    alert("Échec de l'acceptation. Veuillez réessayer.")
  }
}

const handleReject = async (id: number) => {
  setApplications(prev =>
    prev.map(app => app.id === id ? { ...app, status: "rejected" } : app)
  )

  try {
    await fetch(`/api/applications/${id}/reject`, {
      method: "POST",
    })
  } catch (error) {
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status: "pending" } : app)
    )
    alert("Échec du refus. Veuillez réessayer.")
  }
}

  const handleViewDocuments = (app: any) => {
    setSelectedApplication(app)
    setIsModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedApplication(null)
    setDocuments([])
  }, [])

  // Gestion de l’événement Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen, closeModal])

  // Filtrage
  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true
    return app.status === filterStatus
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Candidatures Reçues</h2>
        <p className="text-muted-foreground">Traitez et validez les candidatures des étudiants</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Toutes" },
          { key: "pending", label: "En attente" },
          { key: "accepted", label: "Acceptées" },
          { key: "rejected", label: "Refusées" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={filterStatus === tab.key ? "default" : "outline"}
            onClick={() => setFilterStatus(tab.key)}
            className={filterStatus === tab.key ? "bg-primary hover:bg-primary/90" : ""}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="p-6 border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{app.student}</h3>
                  <p className="text-muted-foreground text-sm">{app.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                {getStatusLabel(app.status)}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Stage postulé</p>
                <p className="font-medium text-foreground">{app.stage}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Niveau</p>
                <p className="font-medium text-foreground">{app.level}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Postulation du</p>
                <p className="font-medium text-foreground">{app.appliedDate}</p>
              </div>
            </div>

            {app.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleAccept(app.id)}
                  aria-label={`Accepter la candidature de ${app.student}`}
                >
                  <CheckCircle2 size={16} className="mr-1" />
                  Accepter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(app.id)}
                  aria-label={`Refuser la candidature de ${app.student}`}
                >
                  <X size={16} className="mr-1" />
                  Refuser
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewDocuments(app)}
                  aria-label={`Voir les documents de ${app.student}`}
                >
                  <FileText size={16} className="mr-1" />
                  Voir documents
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modale */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 id="modal-title" className="text-xl font-bold text-gray-900">
              Documents pour {selectedApplication?.student}
            </h3>
            {isLoading ? (
              <p className="text-muted-foreground">Chargement des documents...</p>
            ) : documents.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <FileText size={16} className="text-muted-foreground" />
                    <span className="flex-1 truncate">{doc.name || `Document ${index + 1}`}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(doc.url, "_blank")}
                      aria-label={`Voir ${doc.name || "le document"}`}
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun document trouvé.</p>
            )}
            <Button onClick={closeModal} className="mt-4 w-full">
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}