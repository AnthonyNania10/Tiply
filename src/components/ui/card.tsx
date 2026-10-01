import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line bg-surface p-5 shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
