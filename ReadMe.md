# Buchverwaltung SPA - Abgabe 3

React Single Page Application mit NestJS GraphQL Backend.

**Autor:** Nick Rusnak (runi1015)

**Design:** [Figma Prototype](https://www.figma.com/proto/hHDVC99DEIit6gUguhVJob/SPA_Buch_runi1015?node-id=0-1&t=FYoXTAI8HbdOqmOb-1)

---

## Schnellstart

### Voraussetzungen
- Node.js 22+
- pnpm (`corepack enable`)
- Docker Desktop

### Installation

```bash
# Dependencies installieren
pnpm install

# Frontend bauen
cd frontend && pnpm build
```

### App starten (Docker)

```bash
# Alle Services starten
docker compose up -d

# Status prüfen
docker ps
```

Die App läuft dann auf:
- **Frontend:** https://localhost
- **Backend API:** https://localhost/graphql
- **Keycloak:** http://localhost:8880

### App stoppen

```bash
docker compose down
```

---

## Tests

### E2E Tests (Playwright)

```bash
# Docker muss laufen!
cd frontend
pnpm test:docker
```

### Unit Tests (Vitest)

```bash
cd frontend
pnpm test:unit
```

### Backend Unit Tests

```bash
pnpm test:unit
```

---

## Code Qualität

```bash
# Frontend Lint
cd frontend && pnpm lint

# Backend Lint
pnpm eslint src

# Formatierung prüfen
pnpm prettier --check "src/**/*.ts"
```

---

## Zugangsdaten (Keycloak)

| User | Passwort | Rolle |
|------|----------|-------|
| admin | p | Administrator |

---

## Projektstruktur

```
├── frontend/          # React SPA
│   ├── src/           # Komponenten, Pages, Context
│   └── e2e/           # Playwright E2E Tests
├── src/               # NestJS Backend
├── .github/workflows/ # CI/CD Pipeline
└── docker-compose.yml # Docker Konfiguration
```
