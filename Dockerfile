# ---- Etapa de Construcción (Build Stage) ----
# Usa una imagen base con Node.js y pnpm preinstalado si es posible,
# o una base limpia y lo instalamos como antes. Usaremos la versión con Node 20.
FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar el manifiesto y el lockfile de pnpm
COPY package.json pnpm-lock.yaml ./

# IMPORTANTE: Instalar TODAS las dependencias (producción y desarrollo)
# `nuxt build` requiere dependencias de desarrollo.
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente del proyecto
COPY . .

# Construir la aplicación Nuxt
# El resultado se almacena en el directorio .output
RUN pnpm run build

# ---- Etapa de Producción (Production Stage) ----
# Se recomienda una imagen Node.js más pequeña para la producción
FROM node:20-alpine AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Copiar la salida compilada de la etapa 'builder'
# Esto incluye .output, que tiene el servidor y los assets estáticos.
COPY --from=builder /app/.output ./.output

# Copiar solo el package.json para poder instalar dependencias de runtime.
COPY --from=builder /app/package.json ./

# Instalar solo las dependencias de PRODUCCIÓN necesarias para el runtime del servidor.
# Usamos el script de la etapa anterior para esto
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile --ignore-scripts

# Expone el puerto que usa Nuxt por defecto
EXPOSE 3000

# Define la variable de entorno para indicar que estamos en producción
ENV NODE_ENV=production

# Comando para iniciar el servidor de Nuxt compilado
CMD ["node", ".output/server/index.mjs"]
