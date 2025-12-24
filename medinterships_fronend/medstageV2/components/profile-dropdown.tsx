// components/profile-dropdown.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
  userName: string;
  userRole: "student" | "chief" | "doctor" | "admin";
}

export function ProfileDropdown({ userName, userRole }: ProfileDropdownProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/auth/login");
  };

  const roleLabels = {
    student: "Étudiant",
    chief: "Chef de service",
    doctor: "Médecin",
    admin: "Administrateur",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User size={16} className="text-primary-foreground" />
          </div>
          <span className="font-medium text-sm hidden md:inline">{userName}</span>
          <svg width="12" height="12" fill="currentColor" className="text-muted-foreground">
            <path d="M7.41 8.59L12 4l-4.59-4.59L6 0l-6 6 6 6 1.41-1.41z" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <p className="text-sm font-medium truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {roleLabels[userRole]}
          </p>
        </div>
        <DropdownMenuSeparator />
        {/* ✅ Redirection conditionnelle selon le rôle */}
        <DropdownMenuItem
          onClick={() => {
            const profilePaths = {
              student: "/dashboard/student/profile",
              doctor: "/dashboard/doctor/profile",
              chief: "/dashboard/chief/profile",
              admin: "/dashboard/admin/profile",
            };
            router.push(profilePaths[userRole]);
          }}
        >
          <User className="mr-2 h-4 w-4" />
          {t("nav.profile")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              {t("theme.light")}
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              {t("theme.dark")}
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}