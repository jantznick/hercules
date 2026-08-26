# Deploy Hercules

End-to-end checklist: **Railway** (Postgres + api) + **web** (Railway *or* [Render static](./RENDER.md)) → env / CORS / cookies → Tidal + Resend → verify.

Platform URLs (`*.up.railway.app` / `*.onrender.com`) are fine until custom domains. Detail: [RAILWAY.md](./RAILWAY.md), [RENDER.md](./RENDER.md).

| Host (example) | Service |
| --- | --- |
| `app.yourdomain.com` | Web (Vite SPA) |
| `api.yourdomain.com` | API (Express) |

---

## Local dev

```bash
docker-compose up -d          # Postgres 16
cp .env.example .env          # fill secrets as needed
npm install
npm run db:migrate            # or: npx prisma migrate deploy --schema=prisma/schema.prisma
npm run dev:all               # Vite :5173 + API :3001
```

| File | Local values |
| --- | --- |
| `.env` | `FRONTEND_URLS=http://localhost:5173`, `TIDAL_REDIRECT_URI=http://localhost:5173/api/tidal/callback` |
| Frontend | Leave `VITE_API_URL` unset → Vite proxies `/api` → `:3001` |

Do **not** use production cookie settings locally (`NODE_ENV=development` keeps `sameSite=lax`).

---

## Prerequisites

- [ ] Repo on GitHub connected to Railway (or CLI deploy)
- [ ] Railway account
- [ ] Resend account for magic-link email in production
- [ ] Tidal developer app if using Connect Tidal / catalog
- [ ] DNS access for custom domains (optional; can finish after platform URLs work)

---

## 1. Railway

Deploy in this order. **Docker build context = repo root** for both services.

### 1.1 Postgres

1. New Railway project → **Add PostgreSQL**
2. Note `DATABASE_URL` (reference it from api)

### 1.2 API (public)

| Setting | Value |
| --- | --- |
| Dockerfile path | `apps/api/Dockerfile` |
| Build context | **Repo root** |
| Public domain | Yes (`*.up.railway.app` until DNS) |
| Healthcheck | `GET /api/health` |

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Postgres reference |
| `SESSION_SECRET` | Long random string |
| `NODE_ENV` | `production` |
| `FRONTEND_URLS` | Web origin (set after web exists) |
| `COOKIE_DOMAIN` | Leave unset across different registrable domains |
| `RESEND_API_KEY` | `re_…` |
| `RESEND_FROM_EMAIL` | Verified sender |
| `TIDAL_CLIENT_ID` / `TIDAL_CLIENT_SECRET` | From Tidal |
| `TIDAL_REDIRECT_URI` | `https://<api-public>/api/tidal/callback` (exact match in dashboard) |
| `TIDAL_SCOPES` | Optional; default `search.read playback` |

`npm run start:api` runs Prisma migrate then the server.

```bash
curl -s https://<api-public>/api/health
# {"status":"ok","service":"hercules-api",...}
```

### 1.3 Web (public)

**Option A — Railway** (Docker):

| Setting | Value |
| --- | --- |
| Dockerfile path | `apps/web/Dockerfile` |
| Build context | **Repo root** |
| Public domain | Yes |
| Build env | `VITE_API_URL=https://<api-public>` |

**Option B — Render** (static site): see [RENDER.md](./RENDER.md).

| Setting | Value |
| --- | --- |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Env | `NPM_CONFIG_PRODUCTION=false`, `VITE_API_URL=https://<api-public>` |

Changing `VITE_*` requires a **rebuild**.

Then set api `FRONTEND_URLS` to the web origin and redeploy api if needed.

### 1.4 Env summary

| Variable | Service | Notes |
| --- | --- | --- |
| `DATABASE_URL` | api | From Postgres |
| `SESSION_SECRET` | api | Required |
| `FRONTEND_URLS` | api | CORS allowlist (web origin) |
| `COOKIE_DOMAIN` | api | Optional; only when api + web share a parent domain |
| `RESEND_*` | api | Magic link in production |
| `TIDAL_*` | api | OAuth + catalog |
| `VITE_API_URL` | web (build) | Public api origin |
| `NODE_ENV` | both | `production` |
| `PORT` | both | Railway injects |

---

## 2. Custom domains (optional)

Attach domains in Railway, then point DNS (CNAME / ALIAS) as instructed.

After DNS:

1. Api: `FRONTEND_URLS=https://app.yourdomain.com`, `TIDAL_REDIRECT_URI=https://api.yourdomain.com/api/tidal/callback`, optional `COOKIE_DOMAIN=.yourdomain.com`
2. Rebuild web with `VITE_API_URL=https://api.yourdomain.com`
3. Update Tidal app redirect URI to that **exact** API callback; enable scopes `search.read` and `playback`

---

## 3. Verify

- [ ] `GET https://<api>/api/health` → ok
- [ ] Register / login on web — CORS and cookies work
- [ ] Magic link email arrives (Resend)
- [ ] Connect Tidal → lands back on `/settings` (authorize URL uses `search.read playback`, not legacy `r_usr`)
- [ ] Session survives refresh

**Tidal Error 1002:** enable matching scopes on the developer app, register `TIDAL_REDIRECT_URI` exactly, redeploy api after env changes. Settings surfaces `?tidal=error&reason=…` when the callback runs; errors that stay on `login.tidal.com` are almost always dashboard misconfiguration.
If login fails with CORS or missing cookies:

- Confirm `FRONTEND_URLS` includes the exact browser origin (scheme + host, no path)
- Confirm `NODE_ENV=production` on api (`secure` + `sameSite: none`)
- Confirm web was built with the correct `VITE_API_URL`
- Leave `COOKIE_DOMAIN` unset until hosts share a parent domain

---

## Related

- [RAILWAY.md](./RAILWAY.md) — service map and runbook detail
- [RENDER.md](./RENDER.md) — static SPA on Render
- [`.env.example`](../.env.example) — full variable list
