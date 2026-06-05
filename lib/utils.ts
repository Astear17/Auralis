import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function safeText(value: unknown, maxLength = 160) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function artworkBackground(
  primary: string,
  secondary: string,
  accent: string,
) {
  return {
    backgroundImage: `radial-gradient(circle at 25% 20%, ${accent} 0%, transparent 36%), linear-gradient(145deg, ${primary}, ${secondary})`,
  };
}
