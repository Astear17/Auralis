"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bell, Search } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#05060a]/60 px-4 backdrop-blur-2xl md:px-7">
      <div className="hidden items-center gap-1 md:flex">
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="rounded-full p-2 text-white/50 hover:bg-white/8 hover:text-white"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          aria-label="Go forward"
          onClick={() => router.forward()}
          className="rounded-full p-2 text-white/50 hover:bg-white/8 hover:text-white"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
      <Link
        href="/search"
        className="flex h-10 max-w-lg flex-1 items-center gap-2.5 rounded-full border border-white/8 bg-white/6 px-4 text-sm text-white/35 transition hover:border-white/15 hover:bg-white/8"
      >
        <Search className="size-4" />
        <span>
          {pathname === "/search"
            ? "Search Auralis"
            : "Artists, albums, songs, or a YouTube URL"}
        </span>
        <span className="ml-auto hidden rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/25 sm:inline">
          /
        </span>
      </Link>
      <button
        aria-label="Notifications"
        className="rounded-full p-2.5 text-white/45 hover:bg-white/8 hover:text-white"
      >
        <Bell className="size-4" />
      </button>
      <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
        AU
      </div>
    </header>
  );
}
