import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";

export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold tracking-[.2em] text-emerald-300 uppercase">
        Plain language policy
      </p>
      <h1 className="mt-2 text-5xl font-bold tracking-[-.05em] md:text-7xl">
        Privacy, without static.
      </h1>
      <p className="mt-5 text-base leading-7 text-white/45">
        Auralis is designed without trackers, first-party ads, password
        collection, or hidden monetization scripts.
      </p>
      <GlassPanel className="mt-8 space-y-7 p-6 text-sm leading-7 text-white/50 md:p-8">
        <Section title="Local storage">
          Playback preferences, favorites, and interface settings are stored in
          your browser. User-owned audio files, cover images, and optional LRC
          lyrics are stored in IndexedDB and are not uploaded by the default
          app.
        </Section>
        <Section title="Optional PostgreSQL">
          When a deployer configures `DATABASE_URL`, Auralis can store
          application records such as playlists, favorites, history, and lyrics.
          The included mock fallback works without a database.
        </Section>
        <Section title="YouTube embeds">
          YouTube mode uses the official visible IFrame Player API. YouTube may
          process data according to its own policies. Auralis does not collect
          Google passwords or account credentials, remove ads, extract streams,
          or bypass Premium restrictions.
        </Section>
        <Section title="Optional metadata API">
          When `YOUTUBE_API_KEY` is configured, the server may request public
          video metadata from the official YouTube Data API. No scraping is
          used.
        </Section>
        <Section title="Your control">
          Clear interface preferences from Settings and remove imported local
          audio from the Library at any time.
        </Section>
      </GlassPanel>
      <Link
        href="/settings"
        className="mt-6 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200"
      >
        Back to settings
      </Link>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-1">{children}</p>
    </section>
  );
}
