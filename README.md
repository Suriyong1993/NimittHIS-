# NimittHIS

NimittHIS is a Thai hospital appointment tracking system with no-show detection, patient timeline history, and role-based operational dashboards.

## Current status

- Backend foundation is implemented with Express, Prisma, JWT auth, RBAC, patient CRUD, appointment CRUD, timeline CRUD, no-show tracking, analytics, notifications, and cron scheduler.
- Frontend foundation is implemented with React, Vite, TailwindCSS, React Query, Zustand, login flow, route guard, and application shell.
- Backend and frontend TypeScript type-check both pass.

## Tech stack

- Frontend: React 18, TypeScript, Vite, TailwindCSS, React Router, Zustand, TanStack Query, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, JWT
- Dev tooling: npm workspaces, Docker Compose, Prisma seed data

## Local run

### 1. Install dependencies

```bash
npm install --workspaces
```

If workspace installs are unstable on Windows, install each package separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Prepare services

You need:

- PostgreSQL running on `localhost:5432`
- Redis running on `localhost:6379`

This repository includes `docker-compose.yml`, but Docker was not available in the current environment used to build the app. If Docker is available on your machine:

```bash
docker compose up -d postgres redis
```

### 3. Configure env

- Root `.env` is already prepared for local development defaults.
- Frontend can use [frontend/.env.example](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/.env.example) if you want to override `VITE_API_URL`.

### 4. Push schema and seed

```bash
npm run db:generate
npm run db:push
npm run seed
```

### 5. Start the apps

In terminal 1:

```bash
npm run dev:backend
```

In terminal 2:

```bash
npm run dev:frontend
```

Frontend runs at `http://localhost:5173`

Backend runs at `http://localhost:3001`

## Demo users

- `nurse01 / nurse123`
- `doctor01 / doctor123`
- `manager01 / mgr123`
- `admin01 / admin123`

## Recommended deployment split

For the current architecture, the cleanest split is:

- Frontend: Vercel
- Backend: Render web service
- Database: Supabase Postgres
- Redis: Upstash Redis

This is simpler than forcing the current long-running Express + Redis + cron-based backend fully into Vercel Functions.

## Deployment config included

- [render.yaml](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/render.yaml): Render Blueprint for the backend
- [frontend/vercel.json](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/vercel.json): SPA rewrite config for React Router on Vercel
- [backend/.env.render.example](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/backend/.env.render.example): backend production env template
- [frontend/.env.production.example](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/.env.production.example): frontend production env template

## Vercel frontend setup

Create a Vercel project from this repository and set:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Environment Variable: `VITE_API_URL=https://YOUR_RENDER_SERVICE.onrender.com/api`

The included [frontend/vercel.json](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/vercel.json) rewrites all routes to `index.html` so React Router routes like `/patients/:id` work on refresh.

## Render backend setup

Create a Render Blueprint from this repository or create a Web Service manually with:

- Root Directory: `backend`
- Build Command: `npm install && npm run prisma:generate && npm run build`
- Pre-Deploy Command: `npm run prisma:push`
- Start Command: `npm run start`
- Health Check Path: `/health`

The included [render.yaml](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/render.yaml) already captures this setup.

## Supabase setup for Prisma

Use Supabase Postgres as the app database.

- For persistent backend traffic on Render, use the Supavisor session pooler string on port `5432`
- Put that value into `DATABASE_URL`
- If you later move Prisma to a serverless runtime, switch to transaction mode and add `pgbouncer=true`

## Upstash setup

Use the standard TLS Redis connection string from Upstash:

- Format: `rediss://default:PASSWORD@ENDPOINT:6379`
- Put that value into `REDIS_URL`

The current backend uses `ioredis`, so a normal Upstash Redis URL works without changing application code.

## Production env checklist

Backend on Render:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `FRONTEND_URL`
- Optional Twilio vars if you want real SMS

Frontend on Vercel:

- `VITE_API_URL`

## First production deploy

1. Create Supabase project and copy the session pooler connection string.
2. Create Upstash Redis and copy the TLS Redis URL.
3. Deploy backend on Render using [render.yaml](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/render.yaml).
4. Add backend env values in Render.
5. Deploy frontend on Vercel with root directory `frontend`.
6. Add `VITE_API_URL` in Vercel.
7. Update `CORS_ORIGIN` and `FRONTEND_URL` in Render to the final Vercel domain.

## Notes

- `npm run prisma:push` is used for convenience because this repository does not yet include checked-in Prisma migrations.
- Seed data is intended for demo/staging use. Do not run `npm run seed` against a real production database unless you explicitly want demo records.
