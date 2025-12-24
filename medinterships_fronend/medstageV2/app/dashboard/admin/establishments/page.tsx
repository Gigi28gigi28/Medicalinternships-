"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Edit2, Trash2, Plus, Users, Filter, Eye, Phone, MapPin, Globe, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

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

type Department = {
  id: number
  name: string
  description: string
  establishmentId: number
  chiefId: number | null
  totalPlaces: number
  availablePlaces: number
  createdAt: string
  updatedAt: string
}

export default function AdminEstablishmentsPage() {
  const router = useRouter()
  const [establishments, setEstablishments] = useState<Establishment[]>([
    {
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
    {
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
    {
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
  ])

  // Sample departments data
  const [departments] = useState<Department[]>([
    { id: 1, name: "Cardiologie", description: "Service de cardiologie et maladies cardiovasculaires", establishmentId: 1, chiefId: 1, totalPlaces: 10, availablePlaces: 3, createdAt: "2024-01-15", updatedAt: "2024-01-15" },
    { id: 2, name: "Pédiatrie", description: "Service de soins pour enfants", establishmentId: 1, chiefId: 2, totalPlaces: 8, availablePlaces: 2, createdAt: "2024-01-15", updatedAt: "2024-01-15" },
    { id: 3, name: "Chirurgie Générale", description: "Service de chirurgie générale", establishmentId: 1, chiefId: 3, totalPlaces: 12, availablePlaces: 5, createdAt: "2024-01-15", updatedAt: "2024-01-15" },
    { id: 4, name: "Médecine Interne", description: "Service de médecine interne", establishmentId: 2, chiefId: 4, totalPlaces: 15, availablePlaces: 7, createdAt: "2024-02-20", updatedAt: "2024-02-20" },
    { id: 5, name: "Radiologie", description: "Service de radiologie et imagerie médicale", establishmentId: 2, chiefId: 5, totalPlaces: 6, availablePlaces: 1, createdAt: "2024-02-20", updatedAt: "2024-02-20" },
    { id: 6, name: "Dermatologie", description: "Service de dermatologie", establishmentId: 3, chiefId: 6, totalPlaces: 5, availablePlaces: 2, createdAt: "2024-03-10", updatedAt: "2024-03-10" },
  ])

  // State for filter and modal
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Get unique cities for filter options
  const cities = ["all", ...new Set(establishments.map(est => est.city))]

  // Filter establishments based on selected city
  const filteredEstablishments = selectedCity === "all" 
    ? establishments 
    : establishments.filter(est => est.city === selectedCity)

  // Get departments for selected establishment
  const getEstablishmentDepartments = (establishmentId: number) => {
    return departments.filter(dept => dept.establishmentId === establishmentId)
  }

  // ✅ Show establishment details
  const handleShowDetails = (establishment: Establishment) => {
    setSelectedEstablishment(establishment)
    setShowDetailsModal(true)
  }

  // ✅ Supprimer un établissement
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`❗ Êtes-vous sûr de vouloir supprimer « ${name} » ?\nCette action est irréversible.`)) {
      return
    }

    try {
      console.log("Suppression de l'établissement ID :", id)
      alert(`✅ ${name} a été supprimé avec succès !`)
      setEstablishments((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Erreur suppression :", error)
      alert("❌ Échec de la suppression. Veuillez réessayer.")
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Établissements de Santé</h2>
          <p className="text-muted-foreground">Gérez les hôpitaux et cliniques partenaires</p>
        </div>
        <Link href="/dashboard/admin/establishments/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={20} />
            Ajouter établissement
          </Button>
        </Link>
      </div>

      {/* Filter Section */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter size={18} />
            <span className="text-sm font-medium">Filtrer par ville :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map(city => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCity(city)}
                className="capitalize"
              >
                {city === "all" ? "Toutes les villes" : city}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredEstablishments.length} établissement{filteredEstablishments.length > 1 ? 's' : ''} 
        {selectedCity !== "all" && ` à ${selectedCity}`}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredEstablishments && filteredEstablishments.length > 0 ? (
          filteredEstablishments.map((establishment) => (
            <Card
              key={establishment.id}
              className="p-6 border-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building2 size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{establishment.name}</h3>
                    <p className="text-sm text-muted-foreground">{establishment.city}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {establishment.type}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* 👁️ Détails */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShowDetails(establishment)}
                    aria-label={`Voir les détails de ${establishment.name}`}
                  >
                    <Eye size={16} />
                  </Button>
                  {/* ✏️ Modifier */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/admin/establishments/new?id=${establishment.id}`)
                    }
                    aria-label={`Modifier ${establishment.name}`}
                  >
                    <Edit2 size={16} />
                  </Button>
                  {/* 🗑️ Supprimer */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(establishment.id, establishment.name)}
                    aria-label={`Supprimer ${establishment.name}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Services</p>
                  <p className="text-2xl font-bold text-foreground">
                    {establishment.departments_count || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Étudiants</p>
                    <p className="text-2xl font-bold text-foreground">
                      {establishment.students_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 col-span-2 text-center border-border/50">
            <p className="text-muted-foreground">
              {selectedCity !== "all" 
                ? `Aucun établissement trouvé à ${selectedCity}`
                : "Aucun établissement trouvé"
              }
            </p>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedEstablishment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 size={32} className="text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedEstablishment.name}</h2>
                    <p className="text-muted-foreground">{selectedEstablishment.type} • {selectedEstablishment.city}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Establishment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations de l'établissement</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">{selectedEstablishment.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">{selectedEstablishment.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedEstablishment.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Site web</p>
                      <p className="text-sm text-muted-foreground">{selectedEstablishment.website}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedEstablishment.departments_count}</p>
                  <p className="text-sm text-muted-foreground">Services</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedEstablishment.students_count}</p>
                  <p className="text-sm text-muted-foreground">Étudiants total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {selectedEstablishment.isActive ? "Actif" : "Inactif"}
                  </p>
                  <p className="text-sm text-muted-foreground">Statut</p>
                </div>
              </div>

              {/* Departments List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Services ({getEstablishmentDepartments(selectedEstablishment.id).length})</h3>
                <div className="space-y-3">
                  {getEstablishmentDepartments(selectedEstablishment.id).length > 0 ? (
                    getEstablishmentDepartments(selectedEstablishment.id).map((dept) => (
                      <Card key={dept.id} className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{dept.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {dept.totalPlaces - dept.availablePlaces} / {dept.totalPlaces} étudiants
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {dept.availablePlaces} places disponibles
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center border-border/50">
                      <p className="text-muted-foreground">Aucun service trouvé pour cet établissement</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Fermer
              </Button>
              <Button
                onClick={() => {
                  setShowDetailsModal(false)
                  router.push(`/dashboard/admin/establishments/new?id=${selectedEstablishment.id}`)
                }}
              >
                Modifier l'établissement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}