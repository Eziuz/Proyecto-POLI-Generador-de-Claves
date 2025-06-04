"use client"

import { useState } from "react"
import { Languages, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "../contexts/translation-context"

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
]

export function LanguageSelector() {
  const { changeLanguage, currentLanguage, t, isLoading } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className="cupertino-button glass-effect" disabled>
        <Languages className="h-4 w-4 mr-2" />
        <span className="text-xs">ES</span>
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="cupertino-button glass-effect flex items-center gap-2"
        title={t("accessibility.toggleLanguage")}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-xs font-medium hidden sm:inline">{currentLang.name}</span>
        <span className="text-xs font-medium sm:hidden">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-20 min-w-[140px] rounded-xl acrylic-effect border border-white/20 dark:border-gray-700/30 shadow-lg animate-fade-in">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center gap-3 ${
                  currentLanguage === lang.code ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLanguage === lang.code && <span className="ml-auto text-primary">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
