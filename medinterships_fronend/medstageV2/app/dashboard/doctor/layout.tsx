"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout role="doctor">{children}</DashboardLayout>
}
