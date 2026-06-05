import { Music2 } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <GlassPanel className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-white/8 text-white/60">
        <Music2 className="size-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </GlassPanel>
  );
}
