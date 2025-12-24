// components/layout/dashboard-layout.tsx
"use client";

import type React from "react";
import { Sidebar } from "./sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/profile-dropdown"; // ✅ Importez-le

interface DashboardLayoutProps {
  role: "student" | "chief" | "doctor" | "admin";
  children: React.ReactNode;
}

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* ✅ Remplacez le bloc manuel par le composant ProfileDropdown */}
              <ProfileDropdown userName="Ahmed Benali" userRole={role} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}