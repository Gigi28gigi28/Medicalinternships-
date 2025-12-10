"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Award, Zap, Heart, Stethoscope, Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const features = [
    {
      icon: Stethoscope,
      title: "Recherche Facile",
      description: "Trouvez les meilleurs stages cliniques filtrés par établissement et service médical",
      delay: "0ms",
    },
    {
      icon: Zap,
      title: "Candidatures Simplifiées",
      description: "Postulez en quelques clics avec suivi en temps réel de votre statut",
      delay: "150ms",
    },
    {
      icon: Award,
      title: "Évaluations Transparentes",
      description: "Consultez vos évaluations et téléchargez votre attestation de stage",
      delay: "300ms",
    },
  ]

  const benefits = [
    {
      title: "Pour les Étudiants",
      items: [
        "Accès à des milliers de stages cliniques",
        "Candidature simplifiée en quelques clics",
        "Suivi en temps réel de votre dossier",
        "Évaluations professionnelles détaillées",
      ],
    },
    {
      title: "Pour les Établissements",
      items: [
        "Gestion centralisée des candidatures",
        "Sélection de candidats qualifiés",
        "Suivi du performance des stagiaires",
        "Documentation et attestations automatiques",
      ],
    },
  ]

  const handleStudentLogin = () => router.push("/auth/student-login")
  const handlePersonnelLogin = () => router.push("/auth/login")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MediStage
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStudentLogin}
              className="border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 ease-out bg-transparent"
            >
              Étudiant
            </Button>
            <Button
              size="sm"
              onClick={handlePersonnelLogin}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 ease-out text-primary-foreground"
            >
              Personnel
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border p-4 space-y-3 bg-card">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStudentLogin}
              className="w-full border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 ease-out bg-transparent"
            >
              Espace Étudiant
            </Button>
            <Button
              size="sm"
              onClick={handlePersonnelLogin}
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 ease-out text-primary-foreground"
            >
              Espace Personnel
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-20">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
              <span className="text-sm font-semibold text-accent">Plateforme Innovante</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Plateforme de Gestion des{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Stages Médicaux
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Une solution complète pour gérer les stages cliniques, les candidatures et les évaluations dans les
              établissements de santé algériens. Simplifiez votre parcours académique ou managérial.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={handleStudentLogin}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-xl text-primary-foreground transition-all duration-300 ease-out"
              >
                Se connecter - Étudiant
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                onClick={handlePersonnelLogin}
                variant="outline"
                className="border-primary/50 hover:bg-primary/5 transition-all duration-300 ease-out bg-transparent"
              >
                Se connecter - Personnel
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="relative p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30"
                  style={{ animationDelay: feature.delay }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent p-3 mb-4 group-hover:shadow-lg transition-shadow">
                      <Icon className="w-full h-full text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Avantages de MediStage</h2>
            <p className="text-lg text-muted-foreground">
              Une plateforme conçue pour tous les acteurs du système de santé
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">{benefit.title}</h3>
                </div>
                <ul className="space-y-4">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Établissements Partenaires" },
              { number: "10K+", label: "Étudiants Actifs" },
              { number: "98%", label: "Taux de Satisfaction" },
              { number: "24/7", label: "Support Disponible" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <p className="text-secondary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Prêt à commencer votre parcours ?</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Rejoignez des milliers d'étudiants et d'établissements qui font confiance à MediStage
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={handleStudentLogin}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-xl text-primary-foreground transition-all duration-300 ease-out"
            >
              Commencer comme Étudiant
            </Button>
            <Button
              size="lg"
              onClick={handlePersonnelLogin}
              variant="outline"
              className="transition-all duration-300 ease-out bg-transparent"
            >
              Accéder au Portail Personnel
            </Button>
          </div>
        </div>
      </section>

      {/* Contact & Newsletter Section */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-8">Nous Contacter</h3>
              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Votre message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground transition-all duration-300 ease-out">
                  Envoyer
                </Button>
              </form>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-8">S'abonner à la Newsletter</h3>
              <p className="text-muted-foreground mb-8">
                Recevez les dernières actualités, offres d'emploi et mises à jour de MediStage directement dans votre
                boîte mail.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-lg text-primary-foreground transition-all duration-300 ease-out">
                  S'abonner
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                Nous respectons votre confidentialité. Désinscrivez-vous à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-secondary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5" />
                <span className="font-bold text-lg">MediStage</span>
              </div>
              <p className="text-secondary-foreground/70 text-sm">
                Plateforme de gestion des stages médicaux en Algérie
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Tarification
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-foreground/20 pt-8">
            <p className="text-center text-sm text-secondary-foreground/60">
              © 2025 MediStage. Tous les droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
