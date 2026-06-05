import type { Metadata } from "next";
import { SettingsPanel } from "@/components/settings/settings-panel";

export const metadata: Metadata = { title: "Settings" };
export default function SettingsPage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-violet-300 uppercase">
        Make it yours
      </p>
      <h1 className="mt-2 mb-7 text-4xl font-bold tracking-tight md:text-6xl">
        Settings
      </h1>
      <SettingsPanel />
    </div>
  );
}
