"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="glass fixed right-2 bottom-2 left-2 z-50 flex h-16 items-center justify-around rounded-2xl px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-w-14 flex-col items-center gap-1 text-[10px] font-medium text-white/40",
              active && "text-white",
            )}
          >
            <Icon className="size-[19px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
