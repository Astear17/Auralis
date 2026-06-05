import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
  as: Element = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "aside";
}) {
  return (
    <Element className={cn("glass rounded-3xl", className)}>{children}</Element>
  );
}
