"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface PasswordHistoryItem {
  id: string
  password: string
  timestamp: Date
  strength: number
}

interface AppContextType {
  history: PasswordHistoryItem[]
  addToHistory: (password: string, strength: number) => void
  clearHistory: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<PasswordHistoryItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("password-history")
      if (saved) {
        const parsed = JSON.parse(saved)
        setHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading history:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("password-history", JSON.stringify(history))
    } catch (error) {
      console.error("Error saving history:", error)
    }
  }, [history])

  const addToHistory = (password: string, strength: number) => {
    const newItem: PasswordHistoryItem = {
      id: Date.now().toString(),
      password,
      timestamp: new Date(),
      strength,
    }
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]) // Keep only last 10
  }

  const clearHistory = () => {
    setHistory([])
  }

  return <AppContext.Provider value={{ history, addToHistory, clearHistory }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
