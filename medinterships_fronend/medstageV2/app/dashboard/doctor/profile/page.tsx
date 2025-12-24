"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Stethoscope, Award, Mail, Upload, AlertCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function DoctorProfilePage() {
  const [formData, setFormData] = useState({
    first_name: "Leila",
    last_name: "Bouzid",
    email: "l.bouzid@chu-kouba.dz",
    phone: "+213 21 987 654",
    establishment: "CHU Kouba",
    department: "Urgences",
    license: "MED-78901",
  })
  const [bio, setBio] = useState("Médecin urgentiste avec 12 ans d'expérience clinique.")
  const [saved, setSaved] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(80)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      formData.establishment,
      formData.department,
      formData.license,
      bio,
    ].filter(Boolean).length

    // +1 si avatar est sélectionné
    const completionPoints = avatarPreview ? filledFields + 1 : filledFields
    const totalFields = 9 // 8 champs + avatar
    setProfileCompletion(Math.round((completionPoints / totalFields) * 100))
  }, [formData, bio, avatarPreview])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bio,
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
    { label: "Évaluations données", value: "15", icon: Stethoscope },
    { label: "Stages supervisés", value: "9", icon: Award },
    { label: "Années d'expérience", value: "12", icon: Award },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mon Profil Médecin</h2>
        <p className="text-muted-foreground">Gérez vos informations professionnelles</p>
      </div>

      {saved && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-2">
          <Mail size={18} />
          <p className="text-sm font-medium">Profil mis à jour avec succès</p>
        </div>
      )}

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
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-6">Informations Professionnelles</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                  <Input name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                  <Input name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Établissement</label>
                <Input name="establishment" value={formData.establishment} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Département</label>
                <Input name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">N° de licence médicale</label>
                <Input name="license" value={formData.license} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Biographie</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground resize-none"
                  rows={3}
                  placeholder="Votre expérience, spécialités..."
                />
              </div>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 mt-4">
                Enregistrer les modifications
              </Button>
            </form>
          </Card>
        </div>

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
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Stethoscope size={40} className="text-primary-foreground" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              Dr. {formData.first_name} {formData.last_name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{formData.department}</p>

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
                className="w-full gap-2 bg-transparent"
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
                    <li>✓ Informations professionnelles</li>
                    <li>✓ Licence médicale</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}