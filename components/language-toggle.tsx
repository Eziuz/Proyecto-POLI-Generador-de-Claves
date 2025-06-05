"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "../contexts/translation-context"

export function LanguageToggle() {
  const { changeLanguage, currentLanguage, t, isLoading } = useTranslation()

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "es" ? "en" : "es"
    changeLanguage(newLanguage)
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="cupertino-button glass-effect" disabled>
        <Languages className="h-5 w-5" />
        <span className="absolute -bottom-1 -right-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
          ES
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="cupertino-button glass-effect"
      title={t("accessibility.toggleLanguage")}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">{t("accessibility.toggleLanguage")}</span>
      <span className="absolute -bottom-1 -right-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
        {currentLanguage.toUpperCase()}
      </span>
    </Button>
  )
}
