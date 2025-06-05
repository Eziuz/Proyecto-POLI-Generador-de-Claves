"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "../contexts/app-context"
import { TranslationProvider } from "../contexts/translation-context"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TranslationProvider>
        <AppProvider>{children}</AppProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}
