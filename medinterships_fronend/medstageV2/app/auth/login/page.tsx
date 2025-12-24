"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";

interface LoginResponse {
  token: string
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard/admin";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = (await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })) as LoginResponse

      if (!response.token) {
        throw new Error("Token manquant dans la réponse")
      }

      // Stocker le token
      localStorage.setItem("token", response.token)

      // Rediriger vers le dashboard admin
      window.location.href = "/dashboard/admin"
    } catch (err: any) {
      setError(err.message || "Échec de la connexion. Vérifiez vos identifiants.")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-primary/5 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>

      <Card className="w-full max-w-md border-border/50 backdrop-blur-sm bg-background/95 shadow-2xl animate-fade-in-up">
        <div className="p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Connexion Personnel</h1>
            <p className="text-sm text-muted-foreground">Médecins, Chefs de Service et Administrateurs</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border/50 focus:border-primary"
                required
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
                required
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
              Vous êtes étudiant?{" "}
              <Link href="/auth/student-login" className="text-primary hover:underline font-medium">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}