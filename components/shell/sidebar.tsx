"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Compass,
  Heart,
  Home,
  Library,
  ListMusic,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { mockPlaylists } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Discover", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/8 bg-black/20 px-4 pt-5 pb-28 backdrop-blur-3xl lg:flex lg:flex-col">
      <Link href="/" className="mb-7 flex items-center gap-3 px-2">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-pink-400 via-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
          <AudioLines className="size-5 text-white" />
        </span>
        <span className="text-xl font-bold tracking-tight">Auralis</span>
      </Link>
      <nav className="space-y-1">
        {mainLinks.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/7 hover:text-white",
                active && "bg-white/10 text-white shadow-inner shadow-white/5",
              )}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-7 flex items-center justify-between px-3">
        <span className="text-[11px] font-semibold tracking-[0.18em] text-white/35 uppercase">
          Your playlists
        </span>
        <button
          aria-label="Create playlist"
          className="rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        <Link
          href="/library"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/50 hover:bg-white/7 hover:text-white"
        >
          <Heart className="size-4" /> Loved songs
        </Link>
        {mockPlaylists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            className="flex items-center gap-3 truncate rounded-xl px-3 py-2 text-sm text-white/50 hover:bg-white/7 hover:text-white"
          >
            <ListMusic className="size-4 shrink-0" />{" "}
            <span className="truncate">{playlist.title}</span>
          </Link>
        ))}
      </div>
      <Link
        href="/settings"
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 hover:bg-white/7 hover:text-white"
      >
        <Settings className="size-[18px]" /> Settings
      </Link>
    </aside>
  );
}
