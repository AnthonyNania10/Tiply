import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {action}
    </Card>
  );
}
