"use client"

import { useState } from "react"
import { Copy, RefreshCw, Eye, EyeOff, History, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { usePasswordGenerator } from "../hooks/use-password-generator"
import { useApp } from "../contexts/app-context"
import { useTranslation } from "../contexts/translation-context"
import { cn } from "@/lib/utils"

export function PasswordGenerator() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [isHistoryAnimating, setIsHistoryAnimating] = useState(false)
  const [validationPassword, setValidationPassword] = useState("")
  const [showValidationPassword, setShowValidationPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  const { password, options, setOptions, generatePassword, evaluateStrength } = usePasswordGenerator()
  const { history, addToHistory, clearHistory } = useApp()

  const handleGenerate = () => {
    const newPassword = generatePassword()
    if (newPassword) {
      const strength = evaluateStrength(newPassword)
      addToHistory(newPassword, strength.score)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleToggleHistory = () => {
    if (showHistory) {
      // Start exit animation
      setIsHistoryAnimating(true)
      setTimeout(() => {
        setShowHistory(false)
        setIsHistoryAnimating(false)
      }, 300) // Match animation duration
    } else {
      setShowHistory(true)
    }
  }

  const passwordStrength = password ? evaluateStrength(password) : null
  const validationStrength = validationPassword ? evaluateStrength(validationPassword) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 md:space-y-4 animate-fade-in pt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Password Generator */}
          <Card className="glass-effect animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <RefreshCw className="h-5 w-5 text-primary" />
                {t("generator.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {/* Generated Password Display */}
              <div className="space-y-2">
                <Label className="text-sm md:text-base">{t("generator.generatedPassword")}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="cupertino-input pr-20 font-mono text-sm md:text-lg"
                    placeholder={t("generator.placeholder")}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8"
                      title={showPassword ? t("accessibility.hidePassword") : t("accessibility.showPassword")}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(password)}
                      disabled={!password}
                      className="h-8 w-8"
                      title={t("accessibility.copyPassword")}
                    >
                      <Copy className={cn("h-4 w-4", copied && "text-green-500")} />
                    </Button>
                  </div>
                </div>
                {passwordStrength && (
                  <div className="space-y-2 animate-bounce-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">{t("strength.label")}</span>
                      <span className="text-xs md:text-sm font-bold" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((passwordStrength.score / 6) * 100, 100)}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    {passwordStrength.suggestions.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">{t("strength.suggestions.title")}</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {passwordStrength.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Length Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm md:text-base">
                    {t("generator.length")}: {options.length}
                  </Label>
                </div>
                <Slider
                  value={[options.length]}
                  onValueChange={([value]) => setOptions((prev) => ({ ...prev, length: value }))}
                  min={4}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Options */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="text-sm md:text-base">
                    {t("generator.options.uppercase")}
                  </Label>
                  <Switch
                    id="uppercase"
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeUppercase: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase" className="text-sm md:text-base">
                    {t("generator.options.lowercase")}
                  </Label>
                  <Switch
                    id="lowercase"
                    checked={options.includeLowercase}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeLowercase: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="text-sm md:text-base">
                    {t("generator.options.numbers")}
                  </Label>
                  <Switch
                    id="numbers"
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeNumbers: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols" className="text-sm md:text-base">
                    {t("generator.options.symbols")}
                  </Label>
                  <Switch
                    id="symbols"
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeSymbols: checked }))}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                className="w-full cupertino-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm md:text-base"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                {t("generator.generateButton")}
              </Button>
            </CardContent>
          </Card>

          {/* Password Validator */}
          <Card className="glass-effect animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Eye className="h-5 w-5 text-primary" />
                {t("validator.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label className="text-sm md:text-base">{t("validator.evaluatePassword")}</Label>
                <div className="relative">
                  <Input
                    type={showValidationPassword ? "text" : "password"}
                    value={validationPassword}
                    onChange={(e) => setValidationPassword(e.target.value)}
                    className="cupertino-input pr-12 font-mono text-sm md:text-base"
                    placeholder={t("validator.placeholder")}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowValidationPassword(!showValidationPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    title={showValidationPassword ? t("accessibility.hidePassword") : t("accessibility.showPassword")}
                  >
                    {showValidationPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {validationStrength && (
                  <div className="space-y-2 animate-bounce-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">{t("strength.label")}</span>
                      <span className="text-xs md:text-sm font-bold" style={{ color: validationStrength.color }}>
                        {validationStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((validationStrength.score / 6) * 100, 100)}%`,
                          backgroundColor: validationStrength.color,
                        }}
                      />
                    </div>
                    {validationStrength.suggestions.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">{t("strength.suggestions.improvementTitle")}</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {validationStrength.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <Card className="glass-effect animate-fade-in overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <History className="h-5 w-5 text-primary" />
                {t("history.title")}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleHistory}
                  className="cupertino-button text-xs md:text-sm"
                >
                  {showHistory ? t("history.hide") : t("history.show")}
                </Button>
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="cupertino-button text-red-600 hover:text-red-700"
                    title={t("accessibility.clearHistory")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {/* History Content with proper animations */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              showHistory && !isHistoryAnimating
                ? "max-h-[500px] opacity-100"
                : isHistoryAnimating
                  ? "max-h-0 opacity-0"
                  : "max-h-0 opacity-0",
            )}
          >
            <CardContent className="pt-0">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm md:text-base">{t("history.empty")}</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-all duration-300",
                        showHistory && !isHistoryAnimating ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                      )}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs md:text-sm truncate">{item.password}</div>
                        <div className="text-xs text-muted-foreground">{item.timestamp.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-xs font-medium">
                          {t("history.strengthLabel")}: {item.strength}/6
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(item.password)}
                          className="h-8 w-8"
                          title={t("accessibility.copyPassword")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
