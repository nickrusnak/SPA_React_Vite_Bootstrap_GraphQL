# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Corepack enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Kopiere Workspace-Definitionen
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. Kopiere Frontend package.json
COPY frontend/package.json ./frontend/

# 3. Installiere Abhängigkeiten (nur für Frontend und Root)
RUN pnpm install --frozen-lockfile --filter frontend...

# 4. Kopiere Source Code
COPY frontend ./frontend

# 5. Build
WORKDIR /app
RUN pnpm --filter frontend build

# Stage 2: Serve
FROM nginx:alpine

# Kopiere Build-Ergebnis vom richtigen Pfad
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
