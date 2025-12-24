"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  User,
  FileText,
  Download,
  Upload,
  Award,
  Mail,
  AlertCircle,
  Eye,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function StudentProfilePage() {
  // Données utilisateur
  const [formData, setFormData] = useState({
    first_name: "Ahmed",
    last_name: "Mohamed",
    email: "ahmed@student.com",
    phone: "+213 55 123 4567",
    level: "L3",
    specialty: "Cardiologie",
  })

  const [city, setCity] = useState("Alger")
  const [bio, setBio] = useState("Étudiant en médecine, passionné par la cardiologie.")
  const [saved, setSaved] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(85)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Documents
  const [documents, setDocuments] = useState([
    { id: "1", file_name: "CV_Ahmed.pdf", uploaded_at: "2024-10-15", file_size: 245000 },
    { id: "2", file_name: "Lettre_motivation.pdf", uploaded_at: "2024-10-16", file_size: 120000 },
  ])

  // Nettoyer l'URL de l'avatar lors du démontage du composant
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  // Calcul de la complétion du profil
  useEffect(() => {
    const filledFields = [
      formData.first_name,
      formData.last_name,
      formData.email,
      formData.phone,
      formData.level,
      formData.specialty,
      city,
      bio,
    ].filter(Boolean).length

    // +1 si avatar est sélectionné
    const completionPoints = avatarPreview ? filledFields + 1 : filledFields
    const totalFields = 9 // 8 champs + avatar
    setProfileCompletion(Math.round((completionPoints / totalFields) * 100))
  }, [formData, city, bio, avatarPreview])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          city,
          bio,
          // avatar: avatarPreview // géré séparément
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      alert("Impossible de contacter le serveur.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newDoc = {
        id: Date.now().toString(),
        file_name: file.name,
        uploaded_at: new Date().toISOString().split("T")[0],
        file_size: file.size,
      }
      setDocuments([...documents, newDoc])
      alert("✅ Document ajouté (simulation)")
    }
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleDownloadDocument = (fileName: string) => {
    alert(`Téléchargement de "${fileName}"\n\n⚠️ Fonctionnalité simulée. En production, le fichier sera téléchargé depuis le serveur.`)
  }

  // Gestion optimisée du changement d'avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert("❌ Veuillez sélectionner une image valide (JPEG, PNG, JPG, WebP)")
        return
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ L'image est trop volumineuse. Taille maximale : 5MB")
        return
      }

      // Libérer l'ancienne URL si elle existe
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }

      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
    
    // Réinitialiser l'input pour permettre la sélection du même fichier
    e.target.value = ""
  }

  // Fonction pour déclencher le click sur l'input file
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const stats = [
    { label: "Stages complétés", value: "2", icon: Award },
    { label: "Candidatures", value: "5", icon: FileText },
    { label: "Évaluations", value: "2/2", icon: Mail },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles et documents</p>
      </div>

      {/* Bouton Historique des Stages */}
      <div className="flex justify-end">
        <Link href="/dashboard/student/internships/history">
          <Button size="sm" variant="ghost" className="bg-primary hover:bg-primary/90 mt-4">
            <Eye size={18} />
            Voir mes stages
          </Button>
        </Link>
      </div>
      

      {saved && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-2">
          <Mail size={18} />
          <p className="text-sm font-medium">Profil mis à jour avec succès</p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-4 border-border/50">
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-6">Informations Personnelles</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ville</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Niveau</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="L2">2ème année</option>
                    <option value="L3">3ème année</option>
                    <option value="M1">4ème année</option>
                    <option value="M2">5ème année</option>
                    <option value="M3">6ème année</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Spécialité</label>
                  <Input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Biographie</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground resize-none"
                  rows={3}
                  placeholder="Parlez un peu de vous..."
                />
              </div>

              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 mt-4">
                Enregistrer les modifications
              </Button>
            </form>
          </Card>
        </div>

        {/* Section Avatar & Complétion */}
        <div className="space-y-6">
          <Card className="p-6 border-border/50 text-center">
            {/* Affichage de l'avatar */}
            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-border/30">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <User size={40} className="text-muted-foreground" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              {formData.first_name} {formData.last_name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{formData.level}</p>

            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground">Complétion</p>
                <p className="text-sm font-bold text-foreground">{profileCompletion}%</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            {/* ✅ Bouton de changement de photo - Version optimisée */}
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={triggerFileInput}
              >
                <Upload size={16} />
                {avatarPreview ? "Changer la photo" : "Ajouter une photo"}
              </Button>
              {!avatarPreview && (
                <p className="text-xs text-muted-foreground mt-2">
                  JPEG, PNG, WebP • Max 5MB
                </p>
              )}
            </div>
          </Card>

          {/* Alert profil incomplet */}
          {profileCompletion < 100 && (
            <Card className="p-4 border-yellow-200/50 bg-yellow-50/20">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800 text-sm">Complétez votre profil</p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                    <li className="flex items-center gap-1">✓ Informations personnelles</li>
                    <li>{avatarPreview ? "✓" : "○"} Photo de profil</li>
                    <li>○ Documents officiels</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Section Documents */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-6">Mes Documents</h3>

        <div className="space-y-4 mb-6">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">{doc.file_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.uploaded_at).toLocaleDateString("fr-FR")} •{" "}
                      {(doc.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    Vérifié
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 bg-transparent"
                    onClick={() => handleDownloadDocument(doc.file_name)}
                  >
                    <Download size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">Aucun document téléchargé</p>
          )}
        </div>

        {/* Upload document */}
        <label className="block">
          <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
            <span>
              <Upload size={18} />
              Télécharger un document
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </span>
          </Button>
        </label>
      </Card>
    </div>
  )
}