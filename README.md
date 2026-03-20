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
     You can use Neon or local script file using `./start-database.sh`.
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

6. Ngrok for listening for Mux webhooks
   1. Keep your dev server running on `http://localhost:3000` (step 5).
   2. In a new terminal, run:
      - `ngrok http 3000`
   3. Copy the `https://...ngrok...` public URL ngrok prints.
   4. Your local webhook endpoint (what you will paste into Mux) is:
      - `<ngrok-public-url>/api/webhooks/mux` (POST)
      - Example: `https://abcd-1234.ngrok-free.app/api/webhooks/mux`

7. Configure webhooks in your Mux account
   1. In the Mux dashboard, create/configure a **Video Webhook** that sends to the URL above.
   2. Subscribe to these event types (these are the ones your app handles):
      - `video.asset.created`
      - `video.asset.ready`
      - `video.asset.errored`
      - `video.asset.deleted`
   3. Uploads created by this app set `meta.passthrough` to the authenticated `userId`, so when `video.asset.created` arrives the webhook can assign `createdById` in the database.

8. Upload a video and confirm the flow
   1. Sign in to Vidora.
   2. Upload via the "Add Video" / "My Studio" flow.
   3. After `video.asset.ready`, the app updates the row with `playbackId`, and the video becomes playable.

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
