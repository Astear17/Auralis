import { AudioLines, Disc3, Sparkles } from "lucide-react";
import type { Artwork as ArtworkType } from "@/lib/types";
import { artworkBackground, cn } from "@/lib/utils";

export function Artwork({
  artwork,
  title,
  className,
  rounded = "rounded-2xl",
}: {
  artwork: ArtworkType;
  title: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${title} artwork`}
      className={cn(
        "relative isolate aspect-square overflow-hidden shadow-2xl shadow-black/30",
        rounded,
        className,
      )}
      style={artworkBackground(
        artwork.primary,
        artwork.secondary,
        artwork.accent,
      )}
    >
      <div className="absolute -top-[18%] -right-[14%] size-[70%] rounded-full border border-white/15 bg-white/10 blur-[1px]" />
      <div className="absolute -bottom-[26%] -left-[16%] size-[82%] rounded-full border border-white/10 bg-black/20" />
      <Sparkles
        className="absolute top-[16%] right-[16%] size-[17%] text-white/25"
        strokeWidth={1.2}
      />
      <Disc3
        className="absolute top-1/2 left-1/2 size-[42%] -translate-1/2 text-white/15"
        strokeWidth={0.8}
      />
      <AudioLines
        className="absolute bottom-[14%] left-[14%] size-[20%] text-white/70 drop-shadow-lg"
        strokeWidth={1.4}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10" />
    </div>
  );
}
