"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Calendar, Users, X, CheckCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const internships = [
    {
      id: 1,
      title: "Stage Cardiologie",
      establishment: "CHU Alger",
      description: "Opportunité de stage en cardiologie pour 4ème année",
      department: "Cardiologie",
      duration: 4,
      startDate: "2025-02-01",
      availablePlaces: 3,
      city: "Alger",
    },
    {
      id: 2,
      title: "Stage Pédiatrie",
      establishment: "Hôpital Ben Aknoun",
      description: "Stage en pédiatrie générale avec suivi individualisé",
      department: "Pédiatrie",
      duration: 6,
      startDate: "2025-02-15",
      availablePlaces: 1,
      city: "Alger",
    },
    {
      id: 3,
      title: "Stage Urgences",
      establishment: "Clinique Centrale Constantine",
      description: "Service des urgences polyvalent, excellente formation pratique",
      department: "Urgences",
      duration: 4,
      startDate: "2025-03-01",
      availablePlaces: 5,
      city: "Constantine",
    },
  ]

  const handleApply = (id: number, title: string) => {
    if (confirm(`Voulez-vous vraiment postuler à "${title}" ?`)) {
    // 🔜 À remplacer par un appel API :
    // await fetch("/api/applications", { method: "POST", body: JSON.stringify({ internshipId: id }) })

      alert(`✅ Candidature envoyée pour "${title}" !`)
    // Optionnel : marquer localement comme "postulé"
    }
  }

  const filteredInternships = internships.filter((internship) => {
    const matchSearch =
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.establishment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchDept = filterDepartment === "all" || internship.department === filterDepartment
    const matchLevel = filterLevel === "all"
    return matchSearch && matchDept && matchLevel
  })

  const activeFilters = [
    { key: "department", label: filterDepartment, value: filterDepartment !== "all" },
    { key: "level", label: filterLevel, value: filterLevel !== "all" },
  ].filter((f) => f.value)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Stages Disponibles</h2>
        <p className="text-muted-foreground">Trouvez et postulez aux meilleurs stages cliniques</p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Rechercher un stage, un département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtres
          </Button>
        </div>

        {showFilters && (
          <Card className="p-6 border-border/50 bg-card/50">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Département</label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    <SelectItem value="Cardiologie">Cardiologie</SelectItem>
                    <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                    <SelectItem value="Urgences">Urgences</SelectItem>
                    <SelectItem value="Chirurgie">Chirurgie</SelectItem>
                    <SelectItem value="Radiologie">Radiologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Année d'études</label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="3">3ème année</SelectItem>
                    <SelectItem value="4">4ème année</SelectItem>
                    <SelectItem value="5">5ème année</SelectItem>
                    <SelectItem value="6">6ème année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="gap-1">
                {filter.label}
                <button
                  onClick={() => {
                    if (filter.key === "department") setFilterDepartment("all")
                    if (filter.key === "level") setFilterLevel("all")
                  }}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredInternships.length} stage{filteredInternships.length !== 1 ? "s" : ""} trouvé
        {filteredInternships.length !== 1 ? "s" : ""}
      </p>

      {/* Internships List */}
      <div className="space-y-4">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship) => (
            <Card
              key={internship.id}
              className="p-6 border-border/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {internship.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">{internship.establishment}</p>
                    </div>
                    <Badge
                      className={`${
                        internship.availablePlaces > 2
                          ? "bg-green-50 border-green-200 text-green-700"
                          : internship.availablePlaces > 0
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                            : "bg-red-50 border-red-200 text-red-700"
                      }`}
                      variant="outline"
                    >
                      {internship.availablePlaces} place{internship.availablePlaces !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-4">{internship.description}</p>

              <div className="grid md:grid-cols-4 gap-4 mb-4 pt-4 border-t border-border/50 border-b">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Durée</p>
                    <p className="font-medium text-foreground">{internship.duration} semaines</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Niveaux</p>
                    <p className="font-medium text-foreground">4-6ème</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Début</p>
                    <p className="font-medium text-foreground">
                      {new Date(internship.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Département</p>
                  <p className="font-medium text-primary">{internship.department}</p>
                </div>
              </div>

              <div className="flex gap-2">
                 <Link href={`/dashboard/student/internships/${internship.id}`} passHref>
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                      Voir les détails
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground gap-2"
                    onClick={() => handleApply(internship.id, internship.title)}
                  >
                    <CheckCircle size={18} />
                      Postuler
                  </Button>
                </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center border-border/50">
            <p className="text-muted-foreground text-lg">Aucun stage ne correspond à vos critères</p>
            <Button
              variant="outline"
              className="mt-4 gap-2 bg-transparent"
              onClick={() => {
                setSearchTerm("")
                setFilterDepartment("all")
                setFilterLevel("all")
              }}
            >
              <X size={18} />
              Réinitialiser les filtres
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
