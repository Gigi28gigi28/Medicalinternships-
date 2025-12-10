"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function ChiefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout role="chief">{children}</DashboardLayout>
}
