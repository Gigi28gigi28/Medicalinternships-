"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit2, ArrowLeft, Building2, MapPin, Phone, Mail, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Types based on your schema
type Establishment = {
  id: number
  name: string
  city: string
  address: string
  phone: string
  email: string
  website: string
  type: 'CHU' | 'Clinique' | 'Hôpital' | 'Polyclinique'
  departments_count: number
  students_count: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EstablishmentFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const establishmentId = searchParams.get("id") // null = création, string = édition

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    type: "Hôpital" as Establishment['type'],
    departments_count: "",
    students_count: "",
    isActive: true
  })

  const [loading, setLoading] = useState(!!establishmentId)
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
        // Simulation avec les nouvelles données :
        const mockData: Record<string, Establishment> = {
          "1": { 
            id: 1,
            name: "Centre Hospitalier Universitaire", 
            city: "Alger", 
            address: "123 Avenue de la Santé, Alger Centre",
            phone: "+213 21 23 45 67",
            email: "contact@chu-alger.dz",
            website: "www.chu-alger.dz",
            type: "CHU",
            departments_count: 12,
            students_count: 45,
            isActive: true,
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15"
          },
          "2": { 
            id: 2,
            name: "Hôpital Général Ben Aknoun", 
            city: "Alger", 
            address: "45 Rue des Frères, Ben Aknoun",
            phone: "+213 21 67 89 01",
            email: "administration@hopital-benaknoun.dz",
            website: "www.hopital-benaknoun.dz",
            type: "Hôpital",
            departments_count: 8,
            students_count: 28,
            isActive: true,
            createdAt: "2024-02-20",
            updatedAt: "2024-02-20"
          },
          "3": { 
            id: 3,
            name: "Clinique Médicale Centrale", 
            city: "Constantine", 
            address: "78 Boulevard de la République, Constantine",
            phone: "+213 31 45 67 89",
            email: "info@clinique-centrale.dz",
            website: "www.clinique-centrale.dz",
            type: "Clinique",
            departments_count: 6,
            students_count: 15,
            isActive: true,
            createdAt: "2024-03-10",
            updatedAt: "2024-03-10"
          },
        }

        const data = mockData[establishmentId]
        if (!data) throw new Error("Non trouvé")

        setFormData({
          name: data.name,
          city: data.city,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          type: data.type,
          departments_count: String(data.departments_count),
          students_count: String(data.students_count),
          isActive: data.isActive
        })
      } catch (error) {
        alert("❌ Impossible de charger l'établissement.")
        router.push("/dashboard/admin/establishments")
      } finally {
        setLoading(false)
      }
    }

    loadEstablishment()
  }, [establishmentId, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isEditMode = !!establishmentId
  const title = isEditMode ? "Modifier l'Établissement" : "Ajouter un Établissement"
  const submitLabel = isEditMode ? "Enregistrer les modifications" : "Ajouter l'établissement"
  const icon = isEditMode ? <Edit2 size={16} /> : <Plus size={16} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const departmentsNum = parseInt(formData.departments_count, 10)
    const studentsNum = parseInt(formData.students_count, 10)

    // Validation
    if (!formData.name || !formData.city || !formData.address || !formData.phone || !formData.email) {
      alert("Veuillez remplir tous les champs obligatoires.")
      setIsSubmitting(false)
      return
    }

    if (isNaN(departmentsNum) || isNaN(studentsNum) || departmentsNum <= 0 || studentsNum <= 0) {
      alert("Le nombre de services et d'étudiants doit être un nombre positif.")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Veuillez entrer une adresse email valide.")
      setIsSubmitting(false)
      return
    }

    try {
      const establishmentData = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        type: formData.type,
        departments_count: departmentsNum,
        students_count: studentsNum,
        isActive: formData.isActive
      }

      if (isEditMode) {
        // 🔜 await fetch(`/api/establishments/${establishmentId}`, { 
        //   method: "PUT", 
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(establishmentData)
        // })
        console.log("Mise à jour :", { id: establishmentId, ...establishmentData })
      } else {
        // 🔜 await fetch("/api/establishments", { 
        //   method: "POST", 
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(establishmentData)
        // })
        console.log("Création :", establishmentData)
      }

      alert(`✅ ${isEditMode ? "Modifié" : "Créé"} avec succès !`)
      router.push("/dashboard/admin/establishments")
    } catch (error) {
      alert("❌ Échec de l'opération.")
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
            ? "Mettez à jour les informations de l'établissement partenaire"
            : "Créez un nouvel hôpital ou clinique partenaire dans le système"}
        </p>
      </div>

      <Card className="p-6 border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations Générales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Informations Générales
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'établissement *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  placeholder="Ex: Centre Hospitalier Universitaire"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'établissement *</Label>
                <Select value={formData.type} onValueChange={(value: Establishment['type']) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHU">CHU</SelectItem>
                    <SelectItem value="Hôpital">Hôpital</SelectItem>
                    <SelectItem value="Clinique">Clinique</SelectItem>
                    <SelectItem value="Polyclinique">Polyclinique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input 
                  id="city" 
                  value={formData.city} 
                  onChange={(e) => handleInputChange('city', e.target.value)} 
                  placeholder="Ex: Alger"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)} 
                  placeholder="Ex: 123 Avenue de la Santé"
                  required 
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone size={20} className="text-primary" />
              Informations de Contact
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                  placeholder="Ex: +213 21 23 45 67"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  placeholder="Ex: contact@etablissement.dz"
                  required 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Site web</Label>
                <Input 
                  id="website" 
                  value={formData.website} 
                  onChange={(e) => handleInputChange('website', e.target.value)} 
                  placeholder="Ex: www.etablissement.dz"
                />
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departments_count">Nombre de services *</Label>
                <Input
                  id="departments_count"
                  type="number"
                  min="1"
                  value={formData.departments_count}
                  onChange={(e) => handleInputChange('departments_count', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="students_count">Nombre d'étudiants *</Label>
                <Input
                  id="students_count"
                  type="number"
                  min="1"
                  value={formData.students_count}
                  onChange={(e) => handleInputChange('students_count', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Statut</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked.toString())}
                className="rounded border-border"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Établissement actif
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Si désactivé, l'établissement ne sera pas visible pour les étudiants
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
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