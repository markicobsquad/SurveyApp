# Sudo Squad Academic Survey

A bilingual Indonesian/English survey application for collecting student feedback about academic schedules and information. The app includes a public survey, an admin dashboard, CSV export, and an installable PWA.

## Stack

- Next.js App Router, React, TypeScript, and Tailwind CSS
- Prisma ORM with PostgreSQL hosted on Neon
- Bun for package management and project commands

## Architecture

The application follows an MVC-style structure:

- `src/app/` contains Next.js routes and thin HTTP route handlers.
- `src/controllers/` validates requests and coordinates application flows.
- `src/models/` performs Prisma queries and maps survey records.
- `src/features/` contains the React views for the survey and admin pages.
- `src/components/` contains shared presentation components.
- `prisma/` contains the PostgreSQL schema and database migrations.

Public routes are `/`, `/admin`, and `/admin/dashboard`. Survey submissions use `POST /api/survey`; admin-only response listing uses `GET /api/survey`.

## Requirements

- Node.js compatible with the installed Next.js version
- Bun
- A Neon PostgreSQL database

## Environment setup

Create `.env` from `.env.example`, then set the following values:

```env
DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require"
DIRECT_URL="postgresql://.../neondb?sslmode=require"
ADMIN_PASSWORD="your-admin-password"
ADMIN_SESSION_SECRET="a-long-random-secret"
```

Use Neon’s pooled connection string for `DATABASE_URL` and its direct connection string for `DIRECT_URL`. Prisma Client uses `DATABASE_URL`; Prisma CLI migrations use `DIRECT_URL`. Keep `.env` private and never commit it.

The admin password and session signing secret are server-only. Admin sessions use a signed, `HttpOnly`, `SameSite=Strict` cookie that expires after eight hours.

## Local development

```bash
bun install
bun run db:generate
bun run db:migrate
bun run dev
```

The development server runs at `http://localhost:3000`.

## Production build and deployment

```bash
bun install --frozen-lockfile
bun run build
bun run db:migrate:deploy
bun run start
```

Apply pending migrations before routing production traffic to the new app version. The build generates Prisma Client and creates a standalone Next.js output. `bun run db:migrate:deploy` applies committed migrations; it does not create a migration. Use `bun run db:migrate` during development when changing the Prisma schema.

## Other commands

```bash
bun run lint
bun run db:studio
bun run icons:generate
```

## Legacy local data

`db/custom.db` is the previous SQLite database. It is kept locally as an archive, ignored by Git, and is not imported into Neon automatically.
