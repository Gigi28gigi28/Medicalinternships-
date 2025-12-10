"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Trash2, Eye, Download, Send, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useApplications } from "@/hooks/use-backend-api"

export default function ApplicationsPage() {
  const { data: applications, loading, error, getApplications } = useApplications()
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      getApplications(token)
    }
  }, [getApplications])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement des candidatures...</p>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      PENDING: {
        icon: Clock,
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
        label: "En attente",
        description: "Votre candidature est en cours d'examen",
      },
      ACCEPTED: {
        icon: CheckCircle,
        color: "bg-green-50 border-green-200 text-green-700",
        label: "Acceptée",
        description: "Félicitations! Votre candidature a été acceptée",
      },
      REJECTED: {
        icon: XCircle,
        color: "bg-red-50 border-red-200 text-red-700",
        label: "Refusée",
        description: "Votre candidature n'a pas été retenue",
      },
      WITHDRAWN: {
        icon: AlertCircle,
        color: "bg-gray-50 border-gray-200 text-gray-700",
        label: "Annulée",
        description: "Vous avez annulé cette candidature",
      },
    }
    return configs[status] || configs.PENDING
  }

  const getStatusCounts = () => {
    if (!applications) return {}
    return {
      all: applications.length,
      PENDING: applications.filter((a: any) => a.status === "PENDING").length,
      ACCEPTED: applications.filter((a: any) => a.status === "ACCEPTED").length,
      REJECTED: applications.filter((a: any) => a.status === "REJECTED").length,
      WITHDRAWN: applications.filter((a: any) => a.status === "WITHDRAWN").length,
    }
  }

  const counts = getStatusCounts()

  const ApplicationCard = ({ app, status }: any) => {
    const config = getStatusConfig(status)
    const Icon = config.icon

    return (
      <Card className={`p-6 border-2 ${config.color}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{app.internship_title}</h3>
              <Badge className="gap-1" variant="outline">
                <Icon size={14} />
                {config.label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{app.establishment_name}</p>
            <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border/50">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Candidature du</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(app.applied_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Début du stage</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(app.internship_start_date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Réponse</p>
            <p className="text-sm font-medium text-foreground">
              {app.status === "PENDING" ? "En attente..." : new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {status === "ACCEPTED" && (
            <>
              <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <Download size={16} />
                Télécharger l'attestation
              </Button>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Send size={16} />
                Confirmer participation
              </Button>
            </>
          )}
          {status === "PENDING" && (
            <>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Eye size={16} />
                Voir les détails
              </Button>
            </>
          )}
          {status === "REJECTED" && (
            <>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Eye size={16} />
                Voir les détails
              </Button>
            </>
          )}
          {status !== "PENDING" && status !== "WITHDRAWN" && (
            <Button size="sm" variant="ghost" className="gap-2 text-destructive hover:bg-destructive/10 ml-auto">
              <Trash2 size={16} />
              Archiver
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mes Candidatures</h2>
        <p className="text-muted-foreground">Suivez l'état de toutes vos candidatures aux stages</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card border border-border w-full justify-start">
          <TabsTrigger value="all">
            Toutes{" "}
            <Badge variant="outline" className="ml-2">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="PENDING">
            En attente{" "}
            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">
              {counts.PENDING}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ACCEPTED">
            Acceptées{" "}
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
              {counts.ACCEPTED}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Refusées{" "}
            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700">
              {counts.REJECTED}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          <TabsContent value="all" className="space-y-4">
            {applications && applications.length > 0 ? (
              applications.map((app: any) => <ApplicationCard key={app.id} app={app} status={app.status} />)
            ) : (
              <Card className="p-8 text-center border-border/50">
                <p className="text-muted-foreground">Aucune candidature pour le moment</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="PENDING" className="space-y-4">
            {applications && applications.filter((a: any) => a.status === "PENDING").length > 0 ? (
              applications
                .filter((a: any) => a.status === "PENDING")
                .map((app: any) => <ApplicationCard key={app.id} app={app} status={app.status} />)
            ) : (
              <Card className="p-8 text-center border-border/50">
                <p className="text-muted-foreground">Aucune candidature en attente</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ACCEPTED" className="space-y-4">
            {applications && applications.filter((a: any) => a.status === "ACCEPTED").length > 0 ? (
              applications
                .filter((a: any) => a.status === "ACCEPTED")
                .map((app: any) => <ApplicationCard key={app.id} app={app} status={app.status} />)
            ) : (
              <Card className="p-8 text-center border-border/50">
                <p className="text-muted-foreground">Aucune candidature acceptée</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="REJECTED" className="space-y-4">
            {applications && applications.filter((a: any) => a.status === "REJECTED").length > 0 ? (
              applications
                .filter((a: any) => a.status === "REJECTED")
                .map((app: any) => <ApplicationCard key={app.id} app={app} status={app.status} />)
            ) : (
              <Card className="p-8 text-center border-border/50">
                <p className="text-muted-foreground">Aucune candidature refusée</p>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
