import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "SecurePass - Generador de Contraseñas Seguras",
    template: "%s | SecurePass",
  },
  description:
    "Genera contraseñas seguras y evalúa su fortaleza en tiempo real. Herramienta gratuita con opciones personalizables, validador de contraseñas y historial. Compatible con dispositivos móviles y de escritorio.",
  keywords: [
    "generador de contraseñas",
    "contraseñas seguras",
    "password generator",
    "seguridad informática",
    "cybersecurity",
    "validador de contraseñas",
    "fortaleza de contraseña",
    "herramientas de seguridad",
    "contraseñas aleatorias",
    "generador online",
    "seguridad digital",
    "protección de datos",
  ],
  authors: [{ name: "SecurePass Team" }],
  creator: "SecurePass",
  publisher: "SecurePass",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://securepass.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: "https://securepass.vercel.app",
    siteName: "SecurePass",
    title: "SecurePass - Generador de Contraseñas Seguras",
    description:
      "Genera contraseñas seguras y evalúa su fortaleza en tiempo real. Herramienta gratuita con opciones personalizables y validador integrado.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SecurePass - Generador de Contraseñas Seguras",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "SecurePass Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@securepass",
    creator: "@securepass",
    title: "SecurePass - Generador de Contraseñas Seguras",
    description:
      "Genera contraseñas seguras y evalúa su fortaleza en tiempo real. Herramienta gratuita y fácil de usar.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "security",
  classification: "Security Tools",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://vercel.com" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* Performance hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SecurePass",
              description: "Generador de contraseñas seguras con validador en tiempo real",
              url: "https://securepass.vercel.app",
              applicationCategory: "SecurityApplication",
              operatingSystem: "Any",
              permissions: "none",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "SecurePass Team",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
              featureList: [
                "Generación de contraseñas seguras",
                "Validador de fortaleza en tiempo real",
                "Opciones personalizables",
                "Historial de contraseñas",
                "Soporte multi-idioma",
                "Modo oscuro/claro",
                "Responsive design",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
