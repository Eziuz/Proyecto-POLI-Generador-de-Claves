import { PasswordGenerator } from "@/components/password-generator"
import { AppHeader } from "@/components/app-header"

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <PasswordGenerator />
    </div>
  )
}
