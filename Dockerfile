# ==== Build ====
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

# Build-time args (desde Dokploy)
ARG API_BASE1
ARG PUBLIC_API_BASE1
ARG API_BASE2
ARG PUBLIC_API_BASE2

# Exportarlos al entorno del build (Nuxt los lee acá)
ENV API_BASE1=$API_BASE1
ENV PUBLIC_API_BASE1=$PUBLIC_API_BASE1
ENV API_BASE2=$API_BASE2
ENV PUBLIC_API_BASE2=$PUBLIC_API_BASE2

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


# ==== Runtime ====
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000
CMD ["pnpm", "start"]
