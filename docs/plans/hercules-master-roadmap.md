# Hercules master roadmap

Full parallel-dispatch plan (auth, Tidal, practice deck v2): see Cursor plan **hercules_master_roadmap** or `.cursor/plans/hercules_master_roadmap_4761dc9f.plan.md`.

## Auth reference

Port [jantznick/api-security](https://github.com/jantznick/api-security) backend patterns (local clone: `~/repos/api-security`):

- Express + Prisma + Postgres
- `express-session` + `connect-pg-simple` → `session` table, cookie `connect.sid`
- Routes: `POST /api/auth/register|login|logout`, `POST /api/auth/magic-token/request|login`, `GET /api/auth/me`
- Email + bcrypt password; magic link issues **6-digit code + UUID** (15 min, single-use)
- Frontend: `credentials: 'include'`, AuthModal with code + link token

**Hercules adds:** rate limits on login/magic-request; full `clearCookie` on logout.

## Waves

0. S0 — remove file upload  
1. Parallel: B1, P1–P5  
2. A1 + A2 auth UI  
3. T1 → T2 → T3 Tidal  
4. M1–M3 mix coaching  
5. Integration

Supersedes [tidal-backend-practice-v2.md](./tidal-backend-practice-v2.md).
