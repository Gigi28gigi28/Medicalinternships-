"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, TrendingUp, Building2, Download, Plus, BarChart3, AlertCircle } from "lucide-react";
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
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api-client";

export default function AdminDashboard() {
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const fetchDashboardData = async () => {
    const token = getToken();
    if (!token) {
      setError("Non authentifié. Veuillez vous reconnecter.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Utilisation de votre apiRequest avec token
      const response = await apiRequest("/dean/dashboard", { token });
      setDashboardData(response.data || response);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue lors du chargement des données.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const exportToPDF = async () => {
    const token = getToken();
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    setIsExporting(true);
    try {
      // Récupérer les données brutes pour le PDF
      const reportResponse = await apiRequest("/dean/reports/export", { token });
      const data = reportResponse.data || reportResponse;

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 14;
      let currentY = margin;

      const addSectionTitle = (title: string, y: number) => {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(title, margin, y);
        return y + 8;
      };

      const createTable = (headers: string[], rows: (string | number)[][], startY: number, color: number[]) => {
        const lineHeight = 10;
        let y = startY;
        const colWidth = (pageWidth - 2 * margin) / headers.length;

        doc.setFont("helvetica", "bold");
        doc.setFillColor(...color);
        doc.setTextColor(255, 255, 255);
        let x = margin;
        headers.forEach((header) => {
          doc.rect(x, y, colWidth, lineHeight, "F");
          doc.text(header, x + 4, y + 7);
          x += colWidth;
        });

        y += lineHeight;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        rows.forEach((row, i) => {
          x = margin;
          const fillColor = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
          doc.setFillColor(...fillColor);
          row.forEach((cell) => {
            doc.rect(x, y, colWidth, lineHeight, "F");
            doc.rect(x, y, colWidth, lineHeight, "S");
            doc.text(String(cell), x + 4, y + 7, { maxWidth: colWidth - 8 });
            x += colWidth;
          });
          y += lineHeight;
        });

        return y + 15;
      };

      // En-tête
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RAPPORT ADMINISTRATIF - SYSTÈME DE GESTION DES STAGES", pageWidth / 2, currentY, { align: "center" });
      currentY += 12;

      doc.setFontSize(11);
      const dateStr = data.generatedAt || new Date().toISOString();
      const date = new Date(dateStr).toLocaleDateString("fr-FR");
      doc.text(`Date de génération : ${date}`, margin, currentY);
      currentY += 6;
      doc.text("Doyen/Administrateur - Vue d'ensemble complète", margin, currentY);
      currentY += 20;

      // Statistiques
      currentY = addSectionTitle("1. STATISTIQUES GLOBALES", currentY);
      const statsRows = [
        ["Total Étudiants", data.totalStudents ?? "N/A"],
        ["Stages Actifs", data.totalInternships ?? "N/A"],
        ["Taux de Placement", `${data.placementRate ?? 0}%`],
        ["Établissements Actifs", data.activeEstablishments ?? "N/A"],
        ["Services Actifs", data.activeServices ?? "N/A"],
      ];
      currentY = createTable(["INDICATEUR", "VALEUR"], statsRows, currentY, [37, 99, 235]);

      // Pied de page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} sur ${pageCount} - Système de Gestion des Stages Médicaux`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      doc.save(`rapport_stages_${date.replace(/\//g, "-")}.pdf`);
    } catch (err: any) {
      console.error("Erreur lors de la génération du PDF :", err);
      alert(err.message || "Une erreur est survenue lors de la génération du PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // === UI Loading / Error ===
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h3 className="font-semibold">Erreur de chargement</h3>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData} className="w-full">
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  // === Données sécurisées ===
  const stats = [
    { label: "Total Étudiants", value: dashboardData?.stats?.totalStudents ?? 0, icon: Users },
    { label: "En stage", value: dashboardData?.stats?.studentsWithInternship ?? 0, icon: TrendingUp },
    { label: "Établissements", value: dashboardData?.stats?.totalEstablishments ?? 0, icon: Building2 },
    { label: "Stages Actifs", value: dashboardData?.stats?.activeInternships ?? 0, icon: Stethoscope },
  ];

  const chartData = dashboardData?.monthlyStats || [
    { month: "Nov", stages: 12, applications: 28, completed: 5 },
    { month: "Déc", stages: 18, applications: 42, completed: 8 },
    { month: "Jan", stages: 25, applications: 35, completed: 12 },
    { month: "Fév", stages: 30, applications: 48, completed: 15 },
    { month: "Mar", stages: 28, applications: 52, completed: 18 },
  ];

  const distributionData = dashboardData?.serviceDistribution || [
    { name: "Cardiologie", value: 18 },
    { name: "Pédiatrie", value: 14 },
    { name: "Urgences", value: 12 },
    { name: "Chirurgie", value: 9 },
    { name: "Médecine Interne", value: 7 },
    { name: "Autres", value: 3 },
  ];

  const COLORS = ["#0891b2", "#7c3aed", "#f59e0b", "#dc2626", "#16a34a", "#6b7280"];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Doyen/Administrateur</h2>
          <p className="text-muted-foreground mt-1">Supervision globale du système</p>
          {dashboardData?.dean && (
            <p className="text-sm text-muted-foreground mt-1">
              {dashboardData.dean.firstName} {dashboardData.dean.lastName}
            </p>
          )}
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={exportToPDF} disabled={isExporting}>
          {isExporting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

      {/* Alertes */}
      {(dashboardData?.alerts?.studentsWithoutInternship > 0 ||
        dashboardData?.alerts?.establishmentsWithoutInternships > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {dashboardData.alerts.studentsWithoutInternship > 0 && (
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertCircle size={20} />
                <p className="font-medium">
                  {dashboardData.alerts.studentsWithoutInternship} étudiant(s) sans stage
                </p>
              </div>
            </Card>
          )}
          {dashboardData.alerts.establishmentsWithoutInternships > 0 && (
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 text-blue-700">
                <AlertCircle size={20} />
                <p className="font-medium">
                  {dashboardData.alerts.establishmentsWithoutInternships} établissement(s) sans stage actif
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

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
                  {stat.label === "En stage" && dashboardData?.stats?.totalStudents > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {dashboardData.stats.placementRate ?? 0}% de placement
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Évolution Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="stages" stroke="#2563eb" strokeWidth={2} name="Stages" />
              <Line type="monotone" dataKey="applications" stroke="#7c3aed" strokeWidth={2} name="Candidatures" />
              <Line type="monotone" dataKey="completed" stroke="#f59e0b" strokeWidth={2} name="Terminés" />
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Actions & Recent Students */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/admin/users/new")}
            >
              <Plus size={18} className="mr-2" />
              Créer un compte
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/admin/establishments")}
            >
              <Building2 size={18} className="mr-2" />
              Gérer établissements
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/admin/statistics")}
            >
              <BarChart3 size={18} className="mr-2" />
              Voir statistiques
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Étudiants Récents</h3>
            <div className="space-y-4">
              {dashboardData?.recentStudents?.length ? (
                dashboardData.recentStudents.map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(student.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun étudiant récent</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}