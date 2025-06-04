"use client"

import { useState, useCallback } from "react"
import { useTranslation } from "../contexts/translation-context"

export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const NUMBERS = "0123456789"
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

export function usePasswordGenerator() {
  const { t } = useTranslation()
  const [password, setPassword] = useState("")
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })

  const generatePassword = useCallback(() => {
    let charset = ""
    let newPassword = ""

    if (options.includeUppercase) charset += UPPERCASE
    if (options.includeLowercase) charset += LOWERCASE
    if (options.includeNumbers) charset += NUMBERS
    if (options.includeSymbols) charset += SYMBOLS

    if (charset === "") return ""

    // Ensure at least one character from each selected type
    if (options.includeUppercase) {
      newPassword += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]
    }
    if (options.includeLowercase) {
      newPassword += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]
    }
    if (options.includeNumbers) {
      newPassword += NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
    }
    if (options.includeSymbols) {
      newPassword += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    }

    // Fill the rest randomly
    for (let i = newPassword.length; i < options.length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)]
    }

    // Shuffle the password
    const shuffled = newPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
    setPassword(shuffled)
    return shuffled
  }, [options])

  const evaluateStrength = useCallback(
    (pwd: string): PasswordStrength => {
      let score = 0
      const suggestions: string[] = []

      if (pwd.length >= 8) score += 1
      else suggestions.push(t("strength.suggestions.minLength"))

      if (pwd.length >= 12) score += 1
      else if (pwd.length >= 8) suggestions.push(t("strength.suggestions.recommendLength"))

      if (/[a-z]/.test(pwd)) score += 1
      else suggestions.push(t("strength.suggestions.includeLowercase"))

      if (/[A-Z]/.test(pwd)) score += 1
      else suggestions.push(t("strength.suggestions.includeUppercase"))

      if (/[0-9]/.test(pwd)) score += 1
      else suggestions.push(t("strength.suggestions.includeNumbers"))

      if (/[^A-Za-z0-9]/.test(pwd)) score += 1
      else suggestions.push(t("strength.suggestions.includeSymbols"))

      if (pwd.length >= 16) score += 1

      const labels = [
        t("strength.levels.veryWeak"),
        t("strength.levels.weak"),
        t("strength.levels.fair"),
        t("strength.levels.good"),
        t("strength.levels.strong"),
        t("strength.levels.veryStrong"),
        t("strength.levels.excellent"),
      ]
      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a", "#15803d", "#166534"]

      return {
        score,
        label: labels[Math.min(score, 6)],
        color: colors[Math.min(score, 6)],
        suggestions: suggestions.slice(0, 3),
      }
    },
    [t],
  )

  return {
    password,
    options,
    setOptions,
    generatePassword,
    evaluateStrength,
  }
}
