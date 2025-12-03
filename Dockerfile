# ---- Etapa de Construcción (Build Stage) ----
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar el manifiesto y el lockfile de pnpm
COPY package.json pnpm-lock.yaml ./

# IMPORTANTE: Instalar TODAS las dependencias (prod + dev) para el build.
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente del proyecto
COPY . .

# Construir la aplicación Nuxt (debe generar el .output)
RUN pnpm run build

# ---- Etapa de Producción (Production Stage) ----
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar pnpm en el runner antes de usarlo para instalar dependencias de prod.
RUN npm install -g pnpm

# COPIAR ARCHIVOS ESENCIALES DEL BUILDER:
# 1. El código compilado
COPY --from=builder /app/.output ./.output
# 2. package.json (para saber qué instalar)
COPY --from=builder /app/package.json ./
# 3. pnpm-lock.yaml (¡EL ARCHIVO FALTANTE! Necesario para --frozen-lockfile)
COPY --from=builder /app/pnpm-lock.yaml ./

# Instalar solo las dependencias de PRODUCCIÓN.
# Usamos --frozen-lockfile para mayor seguridad y consistencia.
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

EXPOSE 3000

ENV NODE_ENV=production

# Comando para iniciar el servidor de Nuxt compilado
CMD ["node", ".output/server/index.mjs"]
