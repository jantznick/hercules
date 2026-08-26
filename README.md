# Hercules

DJ practice app: Vite + React SPA, Express API, Postgres (Prisma).

**[Deploy](docs/DEPLOY.md)** — Postgres + api on Railway; web on Railway or [Render static](docs/RENDER.md). Detail: [RAILWAY.md](docs/RAILWAY.md).

## Local

```bash
docker-compose up -d
cp .env.example .env
npm install
npm run db:migrate
npm run dev:all          # http://localhost:5173 (API on :3001)
```

| Path | Role |
| --- | --- |
| `src/` | Vite SPA |
| `apps/api/` | Express API (auth, Tidal, sessions) |
| `prisma/` | Schema + migrations |
| `apps/api/Dockerfile` | Railway api service |
| `apps/web/Dockerfile` | Railway web (static SPA) |

Production env and custom domains: [docs/DEPLOY.md](docs/DEPLOY.md). Variable list: [`.env.example`](.env.example).
