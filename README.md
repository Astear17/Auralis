# Auralis

Auralis is a polished, legal music web app built with Next.js App Router. It combines a rich mock discovery catalog, an official visible YouTube IFrame player, and private playback for user-owned local audio.

## Highlights

- Premium responsive desktop, tablet, and mobile UI with liquid-glass panels
- Source-neutral global player with mock, local audio, and official YouTube embed adapters
- Full-screen now-playing view, queue, favorites, history, Media Session support, and keyboard shortcuts
- Cinematic synced LRC lyrics with auto-scroll, offset adjustment, and timestamp editor
- Local audio, optional cover image, metadata, and LRC storage in browser IndexedDB
- Search, discovery, library, album, artist, playlist, settings, privacy, and player routes
- Zod-validated API routes with safe mock fallback
- Optional PostgreSQL via Prisma and optional official YouTube Data API metadata
- Basic installable PWA manifest and service worker

## Local Development

Requirements: Node.js 20+ and npm.

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
```

- `DATABASE_URL`: optional PostgreSQL connection string. Without it, APIs return polished mock data and validated non-persistent fallback responses.
- `YOUTUBE_API_KEY`: optional key used only by `/api/youtube/metadata` through the official YouTube Data API.
- `NEXT_PUBLIC_APP_NAME`: optional public application name.

For PostgreSQL:

```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

Production deployments run migrations with:

```bash
npm run prisma:migrate
```

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
```

## Render Deployment

The included `render.yaml` configures Auralis as one Render Web Service.

1. Push this repository to GitHub.
2. In Render, create a new Blueprint and select the repository, or create a Node Web Service manually.
3. Use `npm ci && npm run build` as the build command and `npm run start` as the start command.
4. Add `DATABASE_URL` from an optional Render PostgreSQL database.
5. Add `YOUTUBE_API_KEY` only if official metadata lookup is desired.
6. Set the health check path to `/api/health`.

The app remains functional in mock fallback mode when PostgreSQL or the YouTube API key is absent.

## Playback Sources and Legal Limitations

### Mock Mode

The default experience uses original mock metadata, generated CSS gradient artwork, and simulated playback. It contains no copyrighted media assets.

### YouTube Embed Mode

Paste a valid YouTube URL or video ID into Search. Playback uses the official, visible YouTube IFrame Player API. Auralis does not extract streams, download audio, hide the player for background-only playback, block ads, skip sponsors, bypass DRM, or change YouTube/Premium restrictions. YouTube account credentials are never requested or stored.

### Local/User-Owned Audio Mode

Import audio you own from Library > Local Files. Audio, cover images, metadata, and optional LRC files stay in that browser's IndexedDB. This mode is ad-free because it plays user-owned files directly.

## Privacy

Auralis includes no trackers, first-party ads, password collection, or hidden monetization scripts. See `/privacy` in the app for the plain-language policy.
