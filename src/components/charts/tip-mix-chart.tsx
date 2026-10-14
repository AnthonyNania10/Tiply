"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { formatCurrency } from "@/lib/format";
import type { CurrencyCode } from "@/types";
import type { TipMix } from "@/lib/earnings";

const COLORS = { cash: "#0b8f6a", card: "#5b7cfa" } as const;

export function TipMixChart({
  mix,
  currency = "USD",
}: {
  mix: TipMix;
  currency?: CurrencyCode;
}) {
  const data = [
    { key: "cash", label: "Cash tips", value: mix.cash, share: mix.cashShare },
    { key: "card", label: "Card tips", value: mix.card, share: mix.cardShare },
  ];
  const hasData = mix.cash + mix.card > 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="h-40 w-40 shrink-0" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={hasData ? data : [{ key: "empty", label: "", value: 1, share: 0 }]}
              dataKey="value"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={hasData ? 2 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {(hasData ? data : [{ key: "empty" }]).map((entry) => (
                <Cell
                  key={entry.key}
                  fill={
                    entry.key === "cash"
                      ? COLORS.cash
                      : entry.key === "card"
                        ? COLORS.card
                        : "#ebe8e3"
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <dl className="w-full space-y-3">
        {data.map((entry) => (
          <div key={entry.key} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-sm text-muted">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    entry.key === "cash" ? COLORS.cash : COLORS.card,
                }}
              />
              {entry.label}
            </dt>
            <dd className="text-right">
              <span className="tabular block text-sm font-semibold text-ink">
                {formatCurrency(entry.value, currency)}
              </span>
              <span className="tabular block text-xs text-subtle">
                {entry.share}% of tips
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
