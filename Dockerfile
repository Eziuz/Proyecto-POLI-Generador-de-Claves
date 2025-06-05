# Usar Node.js 20 LTS con Alpine como base
FROM node:20-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
# Instalar solo lo necesario para compilar
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Habilitar corepack para Yarn 4
RUN corepack enable

# Copiar archivos de configuración de Yarn
COPY .yarnrc.yml ./
COPY .yarn/releases/ ./.yarn/releases/
COPY package.json yarn.lock* ./

# Instalar dependencias con Yarn 4
RUN yarn install --immutable

# Construir la aplicación
FROM base AS builder
WORKDIR /app

# Habilitar corepack para Yarn 4
RUN corepack enable

# Copiar dependencias y archivos de configuración
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn/ ./.yarn/
COPY --from=deps /app/.yarnrc.yml ./
COPY . .

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicación
RUN yarn build

# Imagen de producción, usar una imagen aún más ligera
FROM node:20-alpine AS runner
WORKDIR /app

# Configurar entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear un usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar solo los archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Configurar permisos para el directorio .next
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Copiar el build optimizado
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no-root
USER nextjs

# Exponer el puerto
EXPOSE 3000

# Configurar variables de entorno para el servidor
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
