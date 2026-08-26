# Render — static frontend

Deploy the Vite SPA as a **Static Site** on [Render](https://render.com). Keep the API + Postgres on Railway (or elsewhere); point the SPA at the public API with `VITE_API_URL`.

Railway still works via `apps/web/Dockerfile` — see [RAILWAY.md](./RAILWAY.md). Full checklist: [DEPLOY.md](./DEPLOY.md).

---

## Why builds fail without this

Render often runs install with `NODE_ENV=production` (or omit-dev), so packages in `devDependencies` are missing. The SPA build needs `typescript`, `vite`, and `@types/*` (`tsc -b && vite build`). Those live in root `dependencies` so a production install still gets them.

Also set `NPM_CONFIG_PRODUCTION=false` so optional tooling (e.g. `prisma` for `postinstall`) is present when you want a full monorepo install.

---

## Static site settings

| Setting | Value |
| --- | --- |
| Root directory | `/` (repo root) |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |

### Environment variables

| Variable | Value |
| --- | --- |
| `NPM_CONFIG_PRODUCTION` | `false` |
| `VITE_API_URL` | Public API origin, e.g. `https://<api>.up.railway.app` (no trailing slash) |

`VITE_*` is inlined at **build** time — change it → trigger a new deploy.

Optional: if you prefer not to set `NPM_CONFIG_PRODUCTION`, use:

```bash
npm install --include=dev && npm run build
```

as the build command instead.

---

## Wire to the API

1. Deploy/note the public API origin
2. Set Render `VITE_API_URL` to that origin and redeploy the static site
3. On the API, set `FRONTEND_URLS` to the Render static origin (e.g. `https://<name>.onrender.com`) and redeploy the API
4. Register / login — confirm credentialed requests and cookies

---

## Related

- [DEPLOY.md](./DEPLOY.md) — end-to-end deploy checklist
- [RAILWAY.md](./RAILWAY.md) — API + optional Railway-hosted web
- [`.env.example`](../.env.example) — full variable list
