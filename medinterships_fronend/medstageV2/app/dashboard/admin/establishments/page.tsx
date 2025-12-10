"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Edit2, Trash2, Plus, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminEstablishmentsPage() {
  const router = useRouter()
  const [establishments, setEstablishments] = useState([
    {
      id: 1,
      name: "Centre Hospitalier Universitaire",
      city: "Alger",
      departments_count: 12,
      students_count: 45,
    },
    {
      id: 2,
      name: "Hôpital Général Ben Aknoun",
      city: "Alger",
      departments_count: 8,
      students_count: 28,
    },
    {
      id: 3,
      name: "Clinique Médicale Centrale",
      city: "Constantine",
      departments_count: 6,
      students_count: 15,
    },
  ])

  // ✅ Supprimer un établissement
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`❗ Êtes-vous sûr de vouloir supprimer « ${name} » ?\nCette action est irréversible.`)) {
      return
    }

    try {
      // 🔜 À remplacer par un vrai appel API :
      // const res = await fetch(`/api/establishments/${id}`, { method: "DELETE" })
      // if (!res.ok) throw new Error("Échec de la suppression")

      // Pour la démo : simuler la suppression
      console.log("Suppression de l'établissement ID :", id)
      alert(`✅ ${name} a été supprimé avec succès !`)

      // Mettre à jour l’UI immédiatement (optimistic update)
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

      <div className="grid md:grid-cols-2 gap-6">
        {establishments && establishments.length > 0 ? (
          establishments.map((establishment) => (
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
                  </div>
                </div>
                <div className="flex gap-2">
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
            <p className="text-muted-foreground">Aucun établissement trouvé</p>
          </Card>
        )}
      </div>
    </div>
  )
}