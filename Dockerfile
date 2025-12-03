# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar package.json y lockfile de pnpm
COPY package*.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --prod

# Copiar el resto del proyecto
COPY . .

# Construir la app Nuxt
RUN pnpm exec nuxt build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app

# Copiar la salida de build de Nuxt
COPY --from=build /app/.output ./.output

# Copiar package.json y lockfile para referencia (opcional)
COPY --from=build /app/package*.json ./
COPY --from=build /app/pnpm-lock.yaml ./

# Instalar pnpm en producción
RUN npm install -g pnpm

# Instalar solo producción
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
