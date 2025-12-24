"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Star } from "lucide-react"
import { useEffect } from "react"

export default function StudentEvaluationsPage() {
    /*
    const handleDownload = (id: number) => {
    // ✅ Simulation : ouvrir un PDF statique
    // Assurez-vous d'avoir un fichier /public/attestations/stage-1.pdf, etc.
    const pdfUrl = `/attestations/stage-${id}.pdf`

    // Vérifie si le fichier existe (optionnel)
    fetch(pdfUrl, { method: "HEAD" })
      .then((response) => {
        if (response.ok) {
          window.open(pdfUrl, "_blank")
        } else {
          alert("❌ Attestation non disponible pour le moment.")
        }
      })
      .catch(() => {
        // 🔜 Ou utiliser une simulation simple :
        alert(`✅ Attestation pour le stage ${id} est prête !\n(Dans une version réelle, un PDF serait téléchargé.)`)
      })
  }
    */ 

    const handleDownload = async (evaluation: typeof evaluations[0]) => {
    // 🔜 === OPTION 1 : TÉLÉCHARGER VIA BACKEND (À ACTIVER PLUS TARD) ===
    /*
    // Redirige vers une route API qui génère et renvoie un PDF
    window.open(`/api/evaluations/${id}/attestation.pdf`, "_blank")
    */

    // Import dynamique pour éviter les erreurs SSR
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Marges
    const margin = 20;
    let y = margin;

    // ===== En-tête =====
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Attestation de Stage", 105, y, { align: "center" });
    y += 12;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Faculté de Médecine – Université d'Alger", 105, y, { align: "center" });
    y += 20;

      // ===== Informations de l'étudiant (simulées) =====
    // ⚠️ Dans une vraie app, vous auriez ces données via props ou contexte
    const student = {
      fullName: "Ahmed Mohamed",
      matricule: "21234567",
      level: "3ème année",
      specialty: "Médecine générale",
    };

    doc.setFont("helvetica", "bold");
    doc.text("Informations de l'étudiant", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Nom : ${student.fullName}`, margin, y);
    y += 6;
    doc.text(`Matricule : ${student.matricule}`, margin, y);
    y += 6;
    doc.text(`Niveau : ${student.level}`, margin, y);
    y += 6;
    doc.text(`Spécialité : ${student.specialty}`, margin, y);
    y += 12;

    // ===== Détails du stage =====
    doc.setFont("helvetica", "bold");
    doc.text("Détails du stage", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Service : ${evaluation.stage}`, margin, y);
    y += 6;
    doc.text(`Superviseur : ${evaluation.supervisor}`, margin, y);
    y += 6;
    doc.text(`Date d'évaluation : ${evaluation.date}`, margin, y);
    y += 6;
    doc.text(`Note obtenue : ${evaluation.note}`, margin, y);
    y += 12;

    // ===== Feedback =====
    doc.setFont("helvetica", "bold");
    doc.text("Commentaire du superviseur", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");

    // Gérer le retour à la ligne automatique pour le feedback
    const feedbackLines = doc.splitTextToSize(evaluation.feedback, 170); // 170 = largeur max
    feedbackLines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    y += 12;

    // ===== Pied de page =====
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Document généré automatiquement • Système MediStage",
      105,
      287,
      { align: "center" }
    );

    // ===== Télécharger =====
    doc.save(`attestation_stage_${evaluation.id}.pdf`);

  }

  const evaluations = [
    {
      id: 1,
      stage: "Cardiologie",
      supervisor: "Dr. Hassan Ahmed",
      date: "29 Déc 2024",
      note: "18/20",
      feedback: "Excellent travail et très bonne intégration dans l'équipe.",
      attestation: true,
    },
    {
      id: 2,
      stage: "Pédiatrie",
      supervisor: "Dr. Sarah Youssef",
      date: "12 Jan 2025",
      note: "17/20",
      feedback: "Bon stage avec une excellente implication.",
      attestation: true,
    },
    {
      id: 3,
      stage: "Urgences",
      supervisor: "Dr. Karim Amin",
      date: "En cours",
      note: "-",
      feedback: "Stage en cours, évaluation à venir",
      attestation: false,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mes Évaluations</h2>
        <p className="text-muted-foreground">Consultez vos évaluations de stage et attestations</p>
      </div>

      <div className="space-y-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="p-6 border-border/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{evaluation.stage}</h3>
                <p className="text-sm text-muted-foreground">Supervisé par {evaluation.supervisor}</p>
              </div>
              {evaluation.note !== "-" && (
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-lg font-bold text-primary">{evaluation.note}</p>
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-4 p-4 rounded-lg bg-muted/50">
              {evaluation.feedback}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                {evaluation.date === "En cours" ? (
                  <span className="text-yellow-600">Évaluation en cours</span>
                ) : (
                  <>Évaluation du {evaluation.date}</>
                )}
              </p>
              {evaluation.attestation && (
                <Button
                  className="bg-primary hover:bg-primary/90 gap-2"
                  onClick={() => handleDownload(evaluation)}
                >
                  <Download size={16} />
                  Télécharger l'attestation
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}