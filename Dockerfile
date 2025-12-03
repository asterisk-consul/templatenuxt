# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json / pnpm-lock.yaml
COPY package*.json ./

# Instalar solo dependencias de producción (omit devDependencies)
RUN npm install --omit=dev

# Copiar todo el proyecto
COPY . .

# Construir la app Nuxt
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app

# Copiar la salida de build de Nuxt
COPY --from=build /app/.output ./.output

# Copiar package.json para referencia (opcional)
COPY --from=build /app/package*.json ./

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", ".output/server/index.mjs"]
