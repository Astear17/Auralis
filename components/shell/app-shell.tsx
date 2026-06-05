import { MiniPlayer } from "@/components/player/mini-player";
import { QueuePanel } from "@/components/player/queue-panel";
import { GradientBackground } from "@/components/ui/gradient-background";
import { MobileNav } from "@/components/shell/mobile-nav";
import { Sidebar } from "@/components/shell/sidebar";
import { TopBar } from "@/components/shell/top-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <GradientBackground />
      <Sidebar />
      <div className="min-h-screen pb-40 lg:pb-28 lg:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-[1680px] px-4 py-5 md:px-7 md:py-7">
          {children}
        </main>
      </div>
      <MiniPlayer />
      <QueuePanel />
      <MobileNav />
    </div>
  );
}
