"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Cloud,
  Database,
  ExternalLink,
  HardDrive,
  Info,
  Moon,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { DeployRenderButton } from "@/components/ui/deploy-render-button";
import { GlassPanel } from "@/components/ui/glass-panel";

type Health = {
  status: string;
  mode: string;
  database: string;
  youtubeApi: string;
  timestamp: string;
};

export function SettingsPanel() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [crossfade, setCrossfade] = useState(false);
  const { data } = useQuery<Health>({
    queryKey: ["health"],
    queryFn: () => fetch("/api/health").then((response) => response.json()),
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setReduceMotion(localStorage.getItem("auralis-reduce-motion") === "true");
      setCrossfade(localStorage.getItem("auralis-crossfade") === "true");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const update = (
    key: string,
    value: boolean,
    setter: (value: boolean) => void,
  ) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <SettingGroup
        icon={Moon}
        title="Appearance"
        description="Auralis uses a deep, adaptive dark theme."
      >
        <SettingRow label="Liquid glass panels" value="Always on" />
        <ToggleRow
          label="Reduce motion"
          checked={reduceMotion}
          onChange={(value) =>
            update("auralis-reduce-motion", value, setReduceMotion)
          }
        />
      </SettingGroup>
      <SettingGroup
        icon={PlayCircle}
        title="Playback"
        description="Controls apply across mock, local, and embed sources."
      >
        <ToggleRow
          label="Crossfade preference"
          checked={crossfade}
          onChange={(value) => update("auralis-crossfade", value, setCrossfade)}
        />
        <SettingRow
          label="Keyboard shortcuts"
          value="Space, arrows, N, P, L, Q"
        />
      </SettingGroup>
      <SettingGroup
        icon={Database}
        title="API status"
        description="Missing services fall back safely to local mock mode."
      >
        <StatusRow label="Application" value={data?.status ?? "Checking"} />
        <StatusRow label="PostgreSQL" value={data?.database ?? "Checking"} />
        <StatusRow
          label="YouTube metadata API"
          value={data?.youtubeApi ?? "Checking"}
        />
      </SettingGroup>
      <SettingGroup
        icon={HardDrive}
        title="Storage"
        description="User-owned audio remains in this browser."
      >
        <SettingRow label="Local audio" value="IndexedDB" />
        <button
          onClick={() => {
            if (
              confirm(
                "Clear Auralis interface preferences? Local audio files will remain.",
              )
            )
              localStorage.clear();
          }}
          className="mt-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white"
        >
          Reset interface preferences
        </button>
      </SettingGroup>
      <SettingGroup
        icon={ShieldCheck}
        title="Privacy"
        description="No trackers, first-party ads, or hidden monetization scripts."
      >
        <p className="text-sm leading-6 text-white/45">
          Auralis never collects passwords or YouTube credentials. Official
          embeds follow YouTube&apos;s own behavior and restrictions.
        </p>
        <Link
          href="/privacy"
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-violet-200"
        >
          Read privacy policy <ExternalLink className="size-3" />
        </Link>
      </SettingGroup>
      <SettingGroup
        icon={Cloud}
        title="Deploy"
        description="Launch your own Auralis instance from the repository Blueprint."
      >
        <p className="text-sm leading-6 text-white/45">
          Creates one free Render Web Service in mock fallback mode. Optional
          PostgreSQL and YouTube API credentials can be added later.
        </p>
        <DeployRenderButton className="mt-3 w-full sm:w-auto" />
      </SettingGroup>
      <SettingGroup
        icon={Info}
        title="About Auralis"
        description="A premium legal music interface, ready for your catalog."
      >
        <SettingRow label="Mode" value={data?.mode ?? "Mock fallback"} />
        <SettingRow label="App version" value="1.0.0" />
      </SettingGroup>
    </div>
  );
}

function SettingGroup({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <GlassPanel className="p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-violet-400/12 text-violet-200">
          <Icon className="size-5" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-white/35">{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </GlassPanel>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/7 pt-3 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="text-right text-xs text-white/30">{value}</span>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/7 pt-3 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
        <CheckCircle2 className="size-3.5" />
        {value}
      </span>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/7 pt-3 text-sm">
      <span className="text-white/50">{label}</span>
      <button
        aria-label={`Toggle ${label}`}
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-violet-500" : "bg-white/12"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}
