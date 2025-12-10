"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, TrendingUp, Building2, Download, Plus, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [isExporting, setIsExporting] = useState(false);

  // Données
  const stats = [
    { label: "Total Étudiants", value: 145, icon: Users },
    { label: "En stage", value: 47, icon: TrendingUp },
    { label: "Établissements", value: 12, icon: Building2 },
    { label: "Services Médicaux", value: 34, icon: Stethoscope },
  ];

  const chartData = [
    { month: "Nov", stages: 12, applications: 28, completed: 5 },
    { month: "Déc", stages: 18, applications: 42, completed: 8 },
    { month: "Jan", stages: 25, applications: 35, completed: 12 },
    { month: "Fév", stages: 30, applications: 48, completed: 15 },
    { month: "Mar", stages: 28, applications: 52, completed: 18 },
  ];

  const distributionData = [
    { name: "Cardiologie", value: 18 },
    { name: "Pédiatrie", value: 14 },
    { name: "Urgences", value: 12 },
    { name: "Chirurgie", value: 9 },
    { name: "Médecine Interne", value: 7 },
    { name: "Autres", value: 3 },
  ];

  // ✅ Fonction d'export avec jsPDF natif uniquement
  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 14;
      let currentY = margin;

      // Couleurs
      const colors = {
        primary: [37, 99, 235],
        secondary: [124, 58, 237],
        accent: [245, 158, 11],
        success: [16, 185, 129]
      };

      // Fonction pour ajouter un titre de section
      const addSectionTitle = (title: string, y: number) => {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(title, margin, y);
        return y + 8;
      };

      // Fonction pour créer un tableau simple
      const createTable = (headers: string[], rows: string[][], startY: number, color: number[]) => {
        const lineHeight = 10;
        const colWidths = [60, 40, 40, 40];
        let y = startY;

        // Ajuster les largeurs de colonnes en fonction du nombre de colonnes
        const actualColWidth = (pageWidth - (2 * margin)) / headers.length;

        // En-têtes avec fond coloré
        doc.setFont("helvetica", "bold");
        doc.setFillColor(color[0], color[1], color[2]);
        doc.setTextColor(255, 255, 255);
        
        let x = margin;
        headers.forEach((header, i) => {
          doc.rect(x, y, actualColWidth, lineHeight, 'F');
          doc.text(header, x + 4, y + 7);
          x += actualColWidth;
        });

        y += lineHeight;

        // Données avec bordures
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(255, 255, 255);
        
        rows.forEach((row, rowIndex) => {
          x = margin;
          row.forEach((cell, colIndex) => {
            // Alternance de couleurs pour les lignes
            if (rowIndex % 2 === 0) {
              doc.setFillColor(248, 250, 252);
            } else {
              doc.setFillColor(255, 255, 255);
            }
            doc.rect(x, y, actualColWidth, lineHeight, 'F');
            doc.rect(x, y, actualColWidth, lineHeight, 'S'); // Bordure
            doc.text(cell, x + 4, y + 7);
            x += actualColWidth;
          });
          y += lineHeight;
        });

        return y + 15;
      };

      // En-tête du document
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("RAPPORT ADMINISTRATIF - SYSTÈME DE GESTION DES STAGES", pageWidth / 2, currentY, { align: "center" });
      currentY += 12;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const date = new Date().toLocaleDateString('fr-FR');
      doc.text(`Date de génération : ${date}`, margin, currentY);
      currentY += 6;
      doc.text("Doyen/Administrateur - Vue d'ensemble complète", margin, currentY);
      currentY += 20;

      // Section 1: Statistiques Globales
      currentY = addSectionTitle("1. STATISTIQUES GLOBALES", currentY);
      const statsHeaders = ["INDICATEUR", "VALEUR"];
      const statsRows = stats.map((s) => [s.label, s.value.toString()]);
      currentY = createTable(statsHeaders, statsRows, currentY, colors.primary);

      // Section 2: Évolution Mensuelle des Stages
      currentY = addSectionTitle("2. ÉVOLUTION MENSUELLE DES STAGES", currentY);
      const evolutionHeaders = ["Mois", "Stages en cours", "Nouvelles candidatures", "Stages terminés"];
      const evolutionRows = chartData.map((item) => [
        item.month,
        item.stages.toString(),
        item.applications.toString(),
        item.completed.toString(),
      ]);
      currentY = createTable(evolutionHeaders, evolutionRows, currentY, colors.secondary);

      // Vérifier si on dépasse la page
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = margin;
      }

      // Section 3: Répartition par Service Médical
      currentY = addSectionTitle("3. RÉPARTITION PAR SERVICE MÉDICAL", currentY);
      const distributionHeaders = ["Service Médical", "Nombre de stages"];
      const distributionRows = distributionData.map((item) => [item.name, item.value.toString()]);
      currentY = createTable(distributionHeaders, distributionRows, currentY, colors.accent);

      // Section 4: Analyse et Tendances
      currentY = addSectionTitle("4. ANALYSE ET TENDANCES", currentY);
      
      const totalStages = chartData.reduce((sum, item) => sum + item.stages, 0);
      const totalApplications = chartData.reduce((sum, item) => sum + item.applications, 0);
      const totalCompleted = chartData.reduce((sum, item) => sum + item.completed, 0);
      const completionRate = ((totalCompleted / totalStages) * 100).toFixed(1);

      const analysisHeaders = ["INDICATEUR DE PERFORMANCE", "VALEUR"];
      const analysisRows = [
        ["Taux de complétion des stages", `${completionRate}%`],
        ["Total candidatures (5 mois)", totalApplications.toString()],
        ["Stages actifs moyens", Math.round(totalStages / chartData.length).toString()],
        ["Service le plus demandé", distributionData[0].name],
      ];
      currentY = createTable(analysisHeaders, analysisRows, currentY, colors.success);

      // Pied de page
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} sur ${pageCount} - Système de Gestion des Stages Médicaux`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Enregistrer le PDF
      doc.save(`rapport_stages_${date.replace(/\//g, '-')}.pdf`);
      
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      alert("Une erreur est survenue lors de la génération du PDF. Voir la console pour plus de détails.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Doyen/Administrateur</h2>
          <p className="text-muted-foreground mt-1">Supervision globale du système</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 gap-2"
          onClick={exportToPDF}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Génération...
            </>
          ) : (
            <>
              <Download size={20} />
              Exporter rapport (PDF)
            </>
          )}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-6 border-border/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Évolution Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="stages" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="applications" stroke="#6d28d9" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completed" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribution par Service</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#0891b2", "#7c3aed", "#f59e0b", "#dc2626", "#16a34a", "#6b7280"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ✅ Nouvelle section ajoutée ici */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Link href="/dashboard/admin/users/new" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus size={18} />
                Créer un compte
              </Button>
            </Link>
            <Link href="/dashboard/admin/establishments" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Building2 size={18} />
                Gérer établissements
              </Button>
            </Link>
            <Link href="/dashboard/admin/statistics" className="block">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 size={18} />
                Voir statistiques
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Activité Récente</h3>
            <div className="space-y-4">
              {[
                { action: "Nouvel étudiant inscrit", user: "Ahmed M.", time: "il y a 2h" },
                { action: "Candidature acceptée", user: "Fatima B.", time: "il y a 4h" },
                { action: "Stage cloturé", user: "Dr. Hassan", time: "il y a 1j" },
                { action: "Évaluation soumise", user: "Dr. Sarah", time: "il y a 1j" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {/* ✅ Fin de la section ajoutée */}
    </div>
  );
}