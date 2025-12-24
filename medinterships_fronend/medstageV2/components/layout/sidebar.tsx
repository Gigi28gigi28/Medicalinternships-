"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { useLanguage } from "@/hooks/use-language"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  CheckCircle,
  Stethoscope,
  Moon,
  Sun,
} from "lucide-react"

interface SidebarProps {
  role: "student" | "chief" | "doctor" | "admin"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme, mounted } = useTheme()
  const { t } = useLanguage()

  const navigationItems = {
    student: [
      { name: t("nav.dashboard"), href: "/dashboard/student", icon: Home },
      { name: t("nav.search"), href: "/dashboard/student/internships", icon: Search },
      { name: t("nav.applications"), href: "/dashboard/student/applications", icon: FileText },
      { name: t("nav.evaluations"), href: "/dashboard/student/evaluations", icon: CheckCircle },
      { name: t("nav.profile"), href: "/dashboard/student/profile", icon: Users },
      { name: t("nav.notifications"), href: "/dashboard/student/notifications", icon: Bell },
    ],
    chief: [
      { name: t("nav.dashboard"), href: "/dashboard/chief", icon: Home },
      { name: t("nav.offers"), href: "/dashboard/chief/internships", icon: Stethoscope },
      { name: t("nav.applications"), href: "/dashboard/chief/applications", icon: FileText },
      { name: t("nav.evaluations"), href: "/dashboard/chief/evaluations", icon: CheckCircle },
      { name: t("nav.statistics"), href: "/dashboard/chief/statistics", icon: BarChart3 },
    ],
    doctor: [
      { name: t("nav.dashboard"), href: "/dashboard/doctor", icon: Home },
      { name: t("nav.students"), href: "/dashboard/doctor/students", icon: Users },
      { name: t("nav.evaluations"), href: "/dashboard/doctor/evaluations", icon: CheckCircle },
    ],
    admin: [
      { name: t("nav.dashboard"), href: "/dashboard/admin", icon: Home },
      { name: t("nav.users"), href: "/dashboard/admin/users", icon: Users },
      { name: t("nav.establishments"), href: "/dashboard/admin/establishments", icon: Stethoscope },
      { name: t("nav.statistics"), href: "/dashboard/admin/statistics", icon: BarChart3 },
      { name: t("nav.settings"), href: "/dashboard/admin/settings", icon: Settings },
    ],
  }

  const items = navigationItems[role]

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href={`/dashboard/${role}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-lg transition-all">
           {/* <span className="text-lg font-bold text-primary-foreground">M</span>*/}
          </div>
          <div>
            <h1 className="text-lg font-bold">MediStage</h1>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {role === "chief"
                ? t("nav.offers")
                : role === "doctor"
                  ? "Médecin"
                  : role === "admin"
                    ? "Admin"
                    : "Étudiant"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || 
                new RegExp(`^${item.href}(\\/\\d+|\\/new|\\/profile|\\/history|\\/)?$`).test(pathname)
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                }`}
              >
                <Icon size={20} />
                <span className="truncate">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Middle Section - Theme & Language */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {mounted && (
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/10"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            <span className="truncate">{theme === "light" ? t("theme.dark") : t("theme.light")}</span>
          </Button>
        )}
        <div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={20} />
          <span className="truncate">{t("nav.logout")}</span>
        </Button>
      </div>
    </div>
  )
}
