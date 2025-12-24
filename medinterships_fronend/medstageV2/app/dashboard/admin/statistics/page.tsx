"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminStatisticsPage() {
  const placementData = [
    { month: "Nov", placed: 8, notPlaced: 12 },
    { month: "Déc", placed: 25, notPlaced: 15 },
    { month: "Jan", placed: 35, notPlaced: 12 },
    { month: "Fév", placed: 42, notPlaced: 8 },
    { month: "Mar", placed: 47, notPlaced: 5 },
  ]

  const departmentDistribution = [
    { name: "Cardiologie", value: 25 },
    { name: "Pédiatrie", value: 20 },
    { name: "Urgences", value: 18 },
    { name: "Chirurgie", value: 15 },
    { name: "Autres", value: 12 },
  ]

  const colors = ["#0891b2", "#7c3aed", "#f59e0b", "#ef4444", "#6b7280"]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Statistiques Globales</h2>
        <p className="text-muted-foreground">Analyse complète du système</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Placement Chart */}
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Placement des Étudiants</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Bar dataKey="placed" fill="var(--color-primary)" />
              <Bar dataKey="notPlaced" fill="var(--color-muted)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribution par Service</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
