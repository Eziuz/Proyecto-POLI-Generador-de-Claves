/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Docker y deployment
  output: 'standalone',
  
  // Configuración de imágenes
  images: {
    domains: [],
    unoptimized: false,
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Configuración de Webpack (si es necesaria)
  webpack: (config, { isServer }) => {
    // Configuraciones personalizadas de webpack aquí
    return config
  },

  // Configuración experimental (solo opciones válidas)
  experimental: {
    // Configuraciones experimentales válidas aquí
  },

  // Configuración de TypeScript
  typescript: {
    // Durante el build en producción, ignorar errores de TypeScript
    // Solo para casos específicos donde sea necesario
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    // Durante el build en producción, ignorar errores de ESLint
    // Solo para casos específicos donde sea necesario
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
