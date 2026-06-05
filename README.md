# Auralis

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Astear17/Auralis)

Auralis is a polished, legal music web app built with Next.js App Router. It combines a rich mock discovery catalog, an official visible YouTube IFrame player, and private playback for user-owned local audio.

## Highlights

- Premium responsive desktop, tablet, and mobile UI with liquid-glass panels
- Source-neutral global player with mock, local audio, and official YouTube embed adapters
- Full-screen now-playing view, queue, favorites, history, Media Session support, and keyboard shortcuts
- Cinematic synced LRC lyrics with auto-scroll, offset adjustment, and timestamp editor
- Local audio, optional cover image, metadata, and LRC storage in browser IndexedDB
- Search, discovery, library, album, artist, playlist, settings, privacy, and player routes
- Zod-validated API routes with safe mock fallback
- PostgreSQL persistence via Prisma on Render, with a safe local mock fallback
- Basic installable PWA manifest and service worker

## Local Development

Requirements: Node.js 24 and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Auralis runs in complete mock mode without any environment variables.

### Environment Variables

```dotenv
DATABASE_URL=
YOUTUBE_API_KEY=
NEXT_PUBLIC_APP_NAME=Auralis
NEXT_PUBLIC_APP_MODE=development
APP_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

- `DATABASE_URL`: optional PostgreSQL connection string. Without it, APIs return polished mock data and validated non-persistent fallback responses.
- `YOUTUBE_API_KEY`: optional key used only by `/api/youtube/metadata` through the official YouTube Data API.
- `NEXT_PUBLIC_APP_NAME`: optional public application name.
- `NEXT_PUBLIC_APP_MODE`: deployment label exposed by `/api/health`.
- `APP_SECRET` and `NEXTAUTH_SECRET`: reserved application secrets generated automatically by Render.
- `NEXTAUTH_URL`: canonical app URL. Update it if you rename the Render web service.

For local PostgreSQL, set `DATABASE_URL`, then create or apply migrations:

```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

Production deployments run migrations with:

```bash
npm run prisma:migrate
```

`npm run render:build` mirrors the Render build process. It generates Prisma,
applies committed migrations when `DATABASE_URL` is set, and safely skips the
migration step when the app is running in local mock fallback mode.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run start
npm run format
npm run prisma:generate
npm run prisma:migrate
npm run render:build
```

## Render Deployment

Click the button below to create the complete Auralis Blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Astear17/Auralis)

The included `render.yaml` provisions:

- `auralis-web`: one Singapore Render Web Service on the free plan
- `auralis-db`: one Singapore Render PostgreSQL database on the free plan
- Automatic private `DATABASE_URL` binding from the database to the web service
- Generated `APP_SECRET` and `NEXTAUTH_SECRET` values
- An optional `YOUTUBE_API_KEY` prompt
- `/api/health` health checks and automatic committed Prisma migrations

1. Click **Deploy to Render**.
2. Sign in to Render and review the Blueprint.
3. Optionally enter a YouTube Data API key, or leave it blank.
4. Click **Deploy Blueprint**.

The web service builds with `npm run render:build`, which generates Prisma,
runs `prisma migrate deploy` against the automatically bound PostgreSQL
database, and builds Next.js. Auto-deploy is disabled so each deployed instance
stays under its owner's control.

If you rename `auralis-web`, update `NEXTAUTH_URL` in the Render dashboard to
the new public URL. The current app does not collect passwords or YouTube
credentials; the generated secrets reserve a secure foundation for future
authenticated features.

Render free web services spin down after 15 minutes without inbound traffic.
Render free PostgreSQL databases expire 30 days after creation, and each
workspace can have only one active free database. Use a paid database or export
data before expiry for a long-lived deployment. See
[Render's free instance limits](https://render.com/free) for current details.
Local development still works without PostgreSQL through Auralis's mock
fallback.

## Playback Sources and Legal Limitations

### Mock Mode

The default experience uses original mock metadata, generated CSS gradient artwork, and simulated playback. It contains no copyrighted media assets.

### YouTube Embed Mode

Paste a valid YouTube URL or video ID into Search. Playback uses the official, visible YouTube IFrame Player API. Auralis does not extract streams, download audio, hide the player for background-only playback, block ads, skip sponsors, bypass DRM, or change YouTube/Premium restrictions. YouTube account credentials are never requested or stored.

### Local/User-Owned Audio Mode

Import audio you own from Library > Local Files. Audio, cover images, metadata, and optional LRC files stay in that browser's IndexedDB. This mode is ad-free because it plays user-owned files directly.

## Privacy

Auralis includes no trackers, first-party ads, password collection, or hidden monetization scripts. See `/privacy` in the app for the plain-language policy.
