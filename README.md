# Vidora

Vidora is a video-sharing web app built with Next.js + tRPC, using Better Auth for authentication, Drizzle ORM for Postgres, and Mux for video hosting/playback.

## Stack

- Next.js (App Router)
- Bun
- Better Auth
- tRPC
- Drizzle ORM + Postgres
- Mux (player/uploader)
- Tailwind CSS + shadcn/ui

## Local setup

1. Install prerequisites
   - `bun`
   - A running Postgres instance
     You can use Neon or local script file using ./start-database.
   - A Mux account (so you can provide `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET`)

2. Create your environment file
   - Copy `.env.example` to `.env`
   - Fill in these required values:
     - `BETTER_AUTH_SECRET`
     - `DATABASE_URL` (example format: `postgresql://postgres:password@localhost:5432/vidora`)
     - `MUX_TOKEN_ID`
     - `MUX_TOKEN_SECRET`

3. Install dependencies
   - `bun install`

4. Create the database tables
   - `bun db:push`

5. Run the dev server
   - `bun dev`
   - Open `http://localhost:3000`

## Useful commands

- `bun dev` - start the development server
- `bun build` - build for production
- `bun start` - run the production server
- `bun db:generate` - generate drizzle artifacts
- `bun db:migrate` - apply migrations (if you have migration files)
- `bun db:push` - sync schema to the database
- `bun db:studio` - open Drizzle Studio
- `bun check` / `bun check:unsafe` - run Biome checks
- `bun typecheck` - run `tsc --noEmit`
