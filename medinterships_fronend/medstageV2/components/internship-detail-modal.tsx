"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Users, Clock, CheckCircle, AlertCircle, X } from "lucide-react"
import { useState } from "react"

interface InternshipDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  internship: {
    id: number
    title: string
    establishment_name: string
    department_name: string
    description: string
    duration_weeks: number
    available_places: number
    start_date: string
    end_date?: string
  } | null
}

export function InternshipDetailModal({ open, onOpenChange, internship }: InternshipDetailModalProps) {
  const [isApplying, setIsApplying] = useState(false)

  if (!internship) return null

  const requirements = [
    "Biologie et Chimie",
    "Maîtrise du français",
    "Assiduité",
    "Capacités d'adaptation",
    "Travail en équipe",
  ]

  const benefits = [
    "Formation pratique intensive",
    "Supervision médicale qualifiée",
    "Certificat de participation",
    "Expérience professionnelle",
  ]

  const schedule = [
    { day: "Lundi - Vendredi", hours: "8h00 - 16h00" },
    { day: "Pauses", hours: "12h00 - 13h00" },
    { day: "Réunions de service", hours: "16h00 - 16h30" },
  ]

  const handleApply = () => {
    setIsApplying(true)
    setTimeout(() => {
      alert("Candidature envoyée avec succès!")
      setIsApplying(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="sticky top-0 bg-background border-b border-border pb-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-foreground">{internship.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {internship.establishment_name}
              </DialogDescription>
            </div>
            <button onClick={() => onOpenChange(false)} className="rounded-lg hover:bg-muted p-2 transition-colors">
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Info */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 border-border/50">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Durée</p>
                  <p className="font-semibold text-foreground">{internship.duration_weeks} semaines</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-border/50">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Début</p>
                  <p className="font-semibold text-foreground">
                    {new Date(internship.start_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-border/50">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Places</p>
                  <p className="font-semibold text-foreground">{internship.available_places}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-border/50">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Département</p>
                  <p className="font-semibold text-foreground text-sm">{internship.department_name}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="requirements">Prérequis</TabsTrigger>
              <TabsTrigger value="schedule">Horaires</TabsTrigger>
              <TabsTrigger value="benefits">Avantages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card className="p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{internship.description}</p>
              </Card>

              <Card className="p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Informations Importantes</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Pré-requis obligatoire</p>
                      <p className="text-xs text-blue-800 mt-0.5">Vous devez avoir suivi les cours préalables</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Certification</p>
                      <p className="text-xs text-green-800 mt-0.5">Une attestation de stage vous sera remise</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 mt-4">
              <Card className="p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Prérequis</h3>
                <div className="space-y-2">
                  {requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
                    >
                      <CheckCircle size={18} className="text-primary flex-shrink-0" />
                      <span className="text-foreground">{req}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <Card className="p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Horaire Quotidien</h3>
                <div className="space-y-2">
                  {schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                    >
                      <span className="font-medium text-foreground">{item.day}</span>
                      <span className="text-muted-foreground">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4 mt-4">
              <Card className="p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Ce que vous allez Apprendre</h3>
                <div className="space-y-2">
                  {benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                    >
                      <CheckCircle size={18} className="text-primary flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact Info */}
          <Card className="p-6 border-border/50 bg-card/50">
            <h3 className="font-semibold text-foreground mb-3">Personne de Contact</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Chef de Service:</span>{" "}
                <span className="font-medium text-foreground">Dr. Mohamed Ben Ali</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium text-foreground">m.benali@chu.dz</span>
              </p>
              <p>
                <span className="text-muted-foreground">Téléphone:</span>{" "}
                <span className="font-medium text-foreground">+213 555 123 456</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-background border-t border-border pt-4 mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground gap-2"
          >
            {isApplying ? "Envoi en cours..." : "Postuler à ce stage"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
