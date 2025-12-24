"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useEffect, useState } from "react"

export default function AdminStatisticsPage() {
  const [keyStatsData, setKeyStatsData] = useState<
    { name: string; value: number; color: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/stats")
        if (!res.ok) {
          throw new Error("Échec du chargement des statistiques")
        }
        const { pendingApplications, publishedInternships, pendingEvaluations } = await res.json()

        const data = [
          { name: "Candidatures\nen attente", value: pendingApplications, color: "#0891b2" },
          { name: "Stages\npubliés", value: publishedInternships, color: "#7c3aed" },
          { name: "Évaluations\nà valider", value: pendingEvaluations, color: "#f59e0b" },
        ]

        setKeyStatsData(data)
      } catch (err: any) {
        console.error("Erreur lors du chargement des stats :", err)
        setError(err.message || "Une erreur inconnue est survenue")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Statistiques Clés</h2>
        <p className="text-muted-foreground">
          Candidatures en attente, stages publiés, évaluations à valider
        </p>
      </div>

      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Vue d’ensemble</h3>
        {loading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Chargement des statistiques...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <p>❌ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={keyStatsData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 90, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                width={100}
              />
              <Tooltip
                formatter={(value) => [value.toString(), "Nombre"]}
                labelFormatter={(label) => label.replace("\\n", " ")}
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {keyStatsData.map((entry, index) => (
                  <rect key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}