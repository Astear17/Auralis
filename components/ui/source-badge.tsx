import { FileAudio, Radio, Video } from "lucide-react";
import type { SourceMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const config = {
  mock: {
    label: "Mock",
    icon: Radio,
    className: "bg-violet-400/15 text-violet-200",
  },
  youtube: {
    label: "YouTube Embed",
    icon: Video,
    className: "bg-red-400/15 text-red-200",
  },
  local: {
    label: "Local",
    icon: FileAudio,
    className: "bg-cyan-400/15 text-cyan-200",
  },
};

export function SourceBadge({
  source,
  compact = false,
}: {
  source: SourceMode;
  compact?: boolean;
}) {
  const item = config[source];
  const Icon = item.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase",
        item.className,
      )}
    >
      <Icon className="size-3" />
      {!compact && item.label}
    </span>
  );
}
