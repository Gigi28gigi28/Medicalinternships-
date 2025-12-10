"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { InternshipForm } from "@/components/forms/internship-form"

export default function NewInternshipPage() {
  return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Créer une Offre de Stage</h2>
          <p className="text-muted-foreground">Publiez une nouvelle offre de stage dans votre département</p>
        </div>

        <Card className="p-8 border-border/50 max-w-3xl">
          <InternshipForm />
        </Card>
      </div>
  )
}
