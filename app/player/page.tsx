import type { Metadata } from "next";
import { FullscreenPlayer } from "@/components/player/fullscreen-player";

export const metadata: Metadata = { title: "Now Playing" };
export default function PlayerPage() {
  return <FullscreenPlayer />;
}
