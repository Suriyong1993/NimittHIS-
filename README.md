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

## Deployment direction

The project is now being aligned toward:

- Frontend: Vercel
- Database: Supabase Postgres
- Future backend direction: migrate backend responsibilities away from the current long-running Express + Redis architecture into a Vercel + Supabase-friendly setup

At this checkpoint, the frontend is ready to deploy on Vercel, and the repository is ready to continue refactoring toward a Vercel + Supabase-only stack.

## Deployment config included

- [frontend/vercel.json](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/vercel.json): SPA rewrite config for React Router on Vercel
- [frontend/.env.production.example](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/.env.production.example): frontend production env template

## Vercel project settings

From your screenshot, the Vercel import is currently using:

- Root Directory: `./`
- Preset: `Other`

For this repository, those should be changed to:

- Root Directory: `frontend`
- Framework Preset: `Vite`

This is important because the deployable frontend app lives under `frontend/`, not the repository root.

The included [frontend/vercel.json](C:/Users/Administrator/Documents/Trae%20Project/NimittHIS%20%20APP/frontend/vercel.json) rewrites all routes to `index.html` so React Router routes like `/patients/:id` work on refresh.

## Current Vercel env

Frontend on Vercel should have:

- `VITE_API_URL`

Right now, if you are deploying frontend only, this can temporarily point to a future backend URL. Once we migrate the data/auth layer deeper into Supabase, we may reduce or remove this dependency.

## Supabase project

From your screenshot, the Supabase project is live and healthy. The project URL shown there will be used later when we wire:

- Supabase database access
- Supabase auth, if we replace custom JWT auth
- Supabase edge/server-side functions, if we move server work off Express

## Recommended next step

1. Fix the Vercel project import settings to `frontend` + `Vite`
2. Finish the first Vercel deploy
3. Then refactor the app from Express/Redis assumptions toward Supabase-native auth/data flows

## Notes

- The current backend code is still present in the repo because it contains business logic, schema, and seeded domain behavior we can migrate incrementally.
- Seed data is intended for demo/staging use. Do not run `npm run seed` against a real production database unless you explicitly want demo records.
