"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Import translations directly
import enTranslations from "../locales/en/common.json"
import esTranslations from "../locales/es/common.json"

interface TranslationContextType {
  t: (key: string) => string
  currentLanguage: string
  changeLanguage: (lang: string) => void
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const translations = {
  en: enTranslations,
  es: esTranslations,
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("es")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load language from localStorage or detect from browser
    try {
      const savedLanguage = localStorage.getItem("language")
      const browserLanguage = navigator.language.split("-")[0]
      const language = savedLanguage || (browserLanguage === "en" ? "en" : "es")
      setCurrentLanguage(language)
    } catch (error) {
      console.error("Error loading language preference:", error)
      setCurrentLanguage("es")
    }
    setIsLoading(false)
  }, [])

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang)
    try {
      localStorage.setItem("language", lang)
    } catch (error) {
      console.error("Error saving language preference:", error)
    }
  }

  const t = (key: string): string => {
    try {
      const keys = key.split(".")
      let value: any = translations[currentLanguage as keyof typeof translations]

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          // Fallback to English if key not found in current language
          value = translations.en
          for (const fallbackKey of keys) {
            if (value && typeof value === "object" && fallbackKey in value) {
              value = value[fallbackKey]
            } else {
              // Return the last part of the key as fallback
              return keys[keys.length - 1] || key
            }
          }
          break
        }
      }

      return typeof value === "string" ? value : key
    } catch (error) {
      console.error("Error translating key:", key, error)
      return key
    }
  }

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, changeLanguage, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
