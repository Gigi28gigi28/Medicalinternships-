"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LanguageContext, type Language } from "@/hooks/use-language"
import { translations } from "@/lib/translations"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved) setLanguage(saved)
    setMounted(true)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[Language]] || key
  }

  if (!mounted) return children

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
