"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, LockOpen, Lock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useUsers } from "@/hooks/use-backend-api"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [loading, setLoading] = useState(true)
  const { data: users } = useUsers()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === "all" || user.role === filterRole
      return matchesSearch && matchesRole
    }) || []

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">Créez et gérez tous les comptes du système</p>
        </div>
        <Link href="/dashboard/admin/users/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={20} />
            Créer un compte
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-80 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
        >
          <option value="all">Tous les rôles</option>
          <option value="student">Étudiant</option>
          <option value="doctor">Médecin</option>
          <option value="chief">Chef de Service</option>
        </select>
      </div>

      {/* Users Table */}
      <Card className="p-6 border-border/50 overflow-x-auto">
        {filteredUsers.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Nom</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Rôle</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Matricule</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4 text-sm text-foreground font-medium">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user.role_display}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{user.matricule || "-"}</td>
                  <td className="py-4 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="ghost">
                        {user.is_active ? <Lock size={16} /> : <LockOpen size={16} />}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
          </div>
        )}
      </Card>
    </div>
  )
}
