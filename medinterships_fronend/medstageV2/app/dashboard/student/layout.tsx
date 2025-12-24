"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout role="student">{children}</DashboardLayout>
}
