import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The window shell the dashboard mockups sit inside.
 *
 * `decorative` frames are `aria-hidden`: they are product illustrations built
 * from sample data, and reading a demo dashboard's numbers aloud is noise when
 * the surrounding prose already makes the point. Frames containing the app's
 * real chart components pass `decorative={false}`, because those ship their own
 * screen-reader data tables that must stay reachable.
 */
export function MockFrame({
  children,
  label,
  className,
  decorative = true,
}: {
  children: ReactNode;
  /** Shown in the window chrome, e.g. the screen being illustrated. */
  label: string;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-float",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-canvas/70 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <p className="ml-1 truncate text-xs font-medium text-subtle">{label}</p>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
