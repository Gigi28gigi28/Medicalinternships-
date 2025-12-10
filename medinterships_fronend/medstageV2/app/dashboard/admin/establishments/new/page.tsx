"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function EstablishmentFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const establishmentId = searchParams.get("id") // null = création, string = édition

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [services, setServices] = useState("")
  const [students, setStudents] = useState("")
  const [loading, setLoading] = useState(!!establishmentId) // chargement si édition
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Charger les données si édition
  useEffect(() => {
    if (!establishmentId) {
      setLoading(false)
      return
    }

    const loadEstablishment = async () => {
      try {
        // 🔜 Remplacer par : const res = await fetch(`/api/establishments/${establishmentId}`)
        // Simulation :
        const mockData: Record<string, any> = {
          "1": { 
            name: "Centre Hospitalier Universitaire", 
            city: "Alger", 
            departments_count: 12, 
            students_count: 45 
          },
          "2": { 
            name: "Hôpital Général Ben Aknoun", 
            city: "Alger", 
            departments_count: 8, 
            students_count: 28 
          },
          "3": { 
            name: "Clinique Médicale Centrale", 
            city: "Constantine", 
            departments_count: 6, 
            students_count: 15 
          },
        }

        const data = mockData[establishmentId]
        if (!data) throw new Error("Non trouvé")

        setName(data.name)
        setCity(data.city)
        setServices(String(data.departments_count))
        setStudents(String(data.students_count))
      } catch (error) {
        alert("❌ Impossible de charger l’établissement.")
        router.push("/dashboard/admin/establishments")
      } finally {
        setLoading(false)
      }
    }

    loadEstablishment()
  }, [establishmentId, router])

  const isEditMode = !!establishmentId
  const title = isEditMode ? "Modifier l’Établissement" : "Ajouter un Établissement"
  const submitLabel = isEditMode ? "Enregistrer les modifications" : "Ajouter l’établissement"
  const icon = isEditMode ? <Edit2 size={16} /> : <Plus size={16} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const servicesNum = parseInt(services, 10)
    const studentsNum = parseInt(students, 10)

    if (!name || !city || isNaN(servicesNum) || isNaN(studentsNum) || servicesNum <= 0 || studentsNum <= 0) {
      alert("Veuillez remplir tous les champs correctement.")
      setIsSubmitting(false)
      return
    }

    try {
      if (isEditMode) {
        // 🔜 await fetch(`/api/establishments/${establishmentId}`, { method: "PUT", ... })
        console.log("Mise à jour :", { id: establishmentId, name, city, servicesNum, studentsNum })
      } else {
        // 🔜 await fetch("/api/establishments", { method: "POST", ... })
        console.log("Création :", { name, city, servicesNum, studentsNum })
      }

      alert(`✅ ${isEditMode ? "Modifié" : "Créé"} avec succès !`)
      router.push("/dashboard/admin/establishments")
    } catch (error) {
      alert("❌ Échec de l’opération.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Chargement...</h2>
        <Card className="p-12 text-center">
          <p>Chargement des données...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Mettez à jour les informations de l’établissement partenaire"
            : "Créez un nouvel hôpital ou clinique partenaire dans le système"}
        </p>
      </div>

      <Card className="p-6 border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Champs identiques --- */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville *</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="services">Nombre de services *</Label>
            <Input
              id="services"
              type="number"
              min="1"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="students">Nombre d’étudiants *</Label>
            <Input
              id="students"
              type="number"
              min="1"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              {icon}
              {isSubmitting ? "En cours..." : submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}