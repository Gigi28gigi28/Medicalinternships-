"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// 🔧 Simule l'appel API – remplace ceci par ton vrai endpoint
const createInternship = async (data: any): Promise<void> => {
  // 💡 Exemple d'appel réel :
  // const res = await fetch("/api/internships", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Échec de la création");
  // return res.json();

  // ⏱️ Simulation de délai réseau
  return new Promise((resolve) => setTimeout(resolve, 800))
}

export function InternshipForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    duration: "",
    places: "",
    startDate: "",
    endDate: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Afficher une alerte avec les données (à des fins de test)
    const confirm = window.confirm(
      `Confirmer la publication ?\n\n` +
      `Titre : ${formData.title}\n` +
      `Département : ${formData.department}\n` +
      `Durée : ${formData.duration} semaines\n` +
      `Places : ${formData.places}\n` +
      `Période : ${formData.startDate} → ${formData.endDate}`
    )

    if (!confirm) return

    setIsSubmitting(true)

    try {
      // 🚀 Appel API
      await createInternship(formData)

      // ✅ Succès : afficher une alerte + rediriger
      alert("✅ Offre de stage publiée avec succès !")
      router.push("/dashboard/chief") // ou router.refresh() si tu veux rester sur la page

    } catch (error) {
      console.error("Erreur lors de la publication :", error)
      alert("❌ Échec de la publication. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/chief")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Titre du Stage</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Stage en Cardiologie"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Département Médical</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            required
          >
            <option value="">Sélectionnez un département</option>
            <option value="cardiology">Cardiologie</option>
            <option value="pediatrics">Pédiatrie</option>
            <option value="emergency">Urgences</option>
            <option value="surgery">Chirurgie</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez le stage..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary focus:outline-none resize-none"
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Durée (semaines)</label>
          <Input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="4"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nombre de places</label>
          <Input
            type="number"
            name="places"
            value={formData.places}
            onChange={handleChange}
            placeholder="2"
            min="1"
            required
          />
        </div>

        <div className="md:col-span-1" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date de début</label>
          <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date de fin</label>
          <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "Publication en cours..." : "Publier le stage"}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Annuler
        </Button>
      </div>
    </form>
  )
}