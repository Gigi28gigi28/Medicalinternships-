"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authApi } from "@/lib/api-client"

export default function StudentLoginPage() {
  const [matricule, setMatricule] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authApi.studentLogin(matricule, password)
      if (response.success) {
        localStorage.setItem("authToken", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        router.push("/dashboard/student")
      } else {
        setError(response.error || "Erreur de connexion")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>

      <Card className="w-full max-w-md border-border/50 backdrop-blur-sm bg-background/95 shadow-2xl animate-fade-in-up">
        <div className="p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Espace Étudiant</h1>
            <p className="text-sm text-muted-foreground">Gestion de vos stages cliniques</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Matricule</label>
              <Input
                type="text"
                placeholder="Ex: 21234567"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="bg-input border-border/50 focus:border-primary"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border/50 focus:border-primary"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Personnel de santé?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
