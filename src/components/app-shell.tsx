import type { ReactNode } from "react";

import { BottomNavigation } from "@/components/bottom-navigation";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { Logo } from "@/components/logo";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:pl-64">
      <DesktopSidebar />

      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-3">
          <Logo />
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark">
            Demo
          </span>
        </div>
      </header>

      <main className="mb-safe mx-auto w-full max-w-xl px-5 py-6 lg:mb-0 lg:max-w-5xl lg:px-10 lg:py-10">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
