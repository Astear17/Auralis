import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

export const renderDeployUrl =
  "https://render.com/deploy?repo=https://github.com/Astear17/Auralis";

export function DeployRenderButton({ className }: { className?: string }) {
  return (
    <a
      href={renderDeployUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:bg-white/90",
        className,
      )}
    >
      <CloudUpload className="size-4" />
      Deploy on Render
    </a>
  );
}
