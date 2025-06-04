"use client"

import { LanguageSelector } from "./language-selector"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-gray-800/50 acrylic-effect">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔐</span>
            </div>
            <span className="font-semibold text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SecurePass
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
