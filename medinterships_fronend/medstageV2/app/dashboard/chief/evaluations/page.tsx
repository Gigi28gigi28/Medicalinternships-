"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, FileText, Clock, Download, X } from "lucide-react"
import { useState } from "react"

export default function ChiefEvaluationsPage() {
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      student: "Ahmed Mohamed",
      stage: "Cardiologie",
      doctor: "Dr. Hassan Ahmed",
      status: "En attente de validation",
      submittedDate: "18 Nov 2024",
      note: "18/20",
      details: "Très bon travail, initiative remarquable, ponctualité exemplaire.",
    },
    {
      id: 2,
      student: "Fatima Benzahra",
      stage: "Pédiatrie",
      doctor: "Dr. Sarah Youssef",
      status: "Validée",
      submittedDate: "17 Nov 2024",
      note: "17/20",
      details: "Étudiante sérieuse, bon contact avec les patients.",
    },
  ])

  // État pour la modale de consultation
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  // ➕ Consulter l'évaluation
  const handleView = (eval_: any) => {
    setSelectedEvaluation(eval_)
    setIsModalOpen(true)
  }

  // ✅ Valider & Générer PDF
  const handleValidate = async (id: number) => {
    // Optimistic update (mise à jour immédiate de l'UI)
    setEvaluations((prev) =>
      prev.map((eval_) =>
        eval_.id === id ? { ...eval_, status: "Validée" } : eval_
      )
    )

    try {
      // 🔜 À remplacer par un vrai appel API :
      // await fetch(`/api/evaluations/${id}/validate`, { method: "POST" })

      // Simuler génération de PDF (ex: téléchargement ou ouverture)
      alert(`✅ Attestation générée pour l'étudiant ID ${id}. (Simulation)`)

      // Optionnel : rediriger vers un PDF réel
      // window.open(`/api/evaluations/${id}/attestation.pdf`, "_blank")
    } catch (error) {
      console.error("Erreur validation:", error)
      // Rollback en cas d'échec
      setEvaluations((prev) =>
        prev.map((eval_) =>
          eval_.id === id ? { ...eval_, status: "En attente de validation" } : eval_
        )
      )
      alert("❌ Échec de la validation. Veuillez réessayer.")
    }
  }

  // 📥 Télécharger l'attestation
  const handleDownloadAttestation = async (eval_: any) => {
    setDownloadingId(eval_.id)
    
    try {
      // Simulation de génération de PDF avec jsPDF
      const { jsPDF } = await import("jspdf")
      
      const doc = new jsPDF()
      
      // En-tête
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("ATTESTATION DE STAGE", 105, 30, { align: "center" })
      
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Faculté de Médecine - Université d'Alger", 105, 40, { align: "center" })
      
      // Ligne séparatrice
      doc.line(20, 50, 190, 50)
      
      // Contenu de l'attestation
      doc.setFontSize(14)
      doc.text("Je soussigné, Chef de Service, atteste que :", 20, 70)
      
      doc.setFont("helvetica", "bold")
      doc.text(`Étudiant(e): ${eval_.student}`, 20, 85)
      doc.setFont("helvetica", "normal")
      doc.text(`A effectué un stage dans le service de : ${eval_.stage}`, 20, 95)
      doc.text(`Sous la supervision du : ${eval_.doctor}`, 20, 105)
      doc.text(`Période du stage : ${eval_.submittedDate}`, 20, 115)
      doc.text(`Note obtenue : ${eval_.note}`, 20, 125)
      
      // Commentaires
      doc.text("Appréciation :", 20, 140)
      doc.setFont("helvetica", "italic")
      doc.text(eval_.details, 20, 150, { maxWidth: 170 })
      
      // Signature
      doc.setFont("helvetica", "normal")
      doc.text("Fait à Alger, le " + new Date().toLocaleDateString('fr-FR'), 20, 200)
      doc.text("Le Chef de Service", 20, 220)
      doc.text(eval_.doctor, 20, 230)
      
      // Cadre
      doc.rect(15, 15, 180, 250)
      
      // Sauvegarder le PDF
      doc.save(`attestation_stage_${eval_.student.replace(/\s+/g, '_')}.pdf`)
      
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      alert("❌ Erreur lors de la génération de l'attestation PDF")
    } finally {
      setDownloadingId(null)
    }
  }

  // Fermer la modale
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvaluation(null)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Évaluations des Stages</h2>
        <p className="text-muted-foreground">Validez les évaluations et générez les attestations</p>
      </div>

      <div className="space-y-4">
        {evaluations.map((eval_) => (
          <Card key={eval_.id} className="p-6 border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{eval_.student}</h3>
                <p className="text-muted-foreground text-sm">
                  {eval_.stage} - Supervisé par {eval_.doctor}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  eval_.status === "En attente de validation"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {eval_.status}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Soumise le</p>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <p className="font-medium text-foreground">{eval_.submittedDate}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Note globale</p>
                <p className="font-bold text-lg text-primary">{eval_.note}</p>
              </div>
            </div>

            {eval_.status === "En attente de validation" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleValidate(eval_.id)}
                >
                  <CheckCircle2 size={16} className="mr-1" />
                  Valider & Générer PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleView(eval_)}
                >
                  <FileText size={16} className="mr-1" />
                  Consulter l'évaluation
                </Button>
              </div>
            )}
            {eval_.status === "Validée" && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownloadAttestation(eval_)}
                disabled={downloadingId === eval_.id}
                className="gap-2"
              >
                {downloadingId === eval_.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Génération...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Télécharger l'attestation
                  </>
                )}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* 🔍 Modale de consultation */}
      {isModalOpen && selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900">Évaluation de {selectedEvaluation.student}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Stage en <strong>{selectedEvaluation.stage}</strong> – {selectedEvaluation.submittedDate}
            </p>
            <div className="mb-4">
              <label className="text-sm text-gray-600 mt-1">
                Note : <span className="text-primary font-bold">{selectedEvaluation.note}</span>
              </label>
            </div>
            <div>
              <label className="text-sm text-gray-600 mt-1">
                Commentaire du médecin :
              </label>
              <p className="text-foreground bg-muted p-3 rounded-md">
                {selectedEvaluation.details}
              </p>
            </div>
            <Button onClick={closeModal} className="mt-4 w-full">
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}