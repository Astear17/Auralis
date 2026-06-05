"use client";

import { useEffect } from "react";
import { KeyboardShortcuts } from "@/components/providers/keyboard-shortcuts";
import { PlaybackRuntime } from "@/components/providers/playback-runtime";
import { QueryProvider } from "@/components/providers/query-provider";
import { ServiceWorkerRegister } from "@/components/providers/service-worker-register";
import { usePlayerStore } from "@/lib/player/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <StoreHydration />
      <PlaybackRuntime />
      <KeyboardShortcuts />
      <ServiceWorkerRegister />
    </QueryProvider>
  );
}

function StoreHydration() {
  useEffect(() => {
    void usePlayerStore.persist.rehydrate();
  }, []);
  return null;
}
