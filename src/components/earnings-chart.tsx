"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import type { CurrencyCode, EarningsPoint } from "@/types";

const AXIS_STYLE = { fontSize: 12, fill: "#9a938b" } as const;

function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: { payload: EarningsPoint }[];
  currency: CurrencyCode;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-line bg-surface px-3 py-2 shadow-card">
      <p className="text-xs font-medium text-muted">{point.label}</p>
      <p className="tabular text-sm font-semibold text-ink">
        {formatCurrency(point.totalEarnings, currency)}
      </p>
      <p className="tabular text-xs text-subtle">
        {formatCurrency(point.tips, currency)} tips · {point.shiftCount} shift
        {point.shiftCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}

/** Screen-reader fallback so chart data is never icon-only information. */
function ChartTable({
  data,
  currency,
  caption,
}: {
  data: EarningsPoint[];
  currency: CurrencyCode;
  caption: string;
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Period</th>
          <th scope="col">Total earnings</th>
        </tr>
      </thead>
      <tbody>
        {data.map((point) => (
          <tr key={point.key}>
            <th scope="row">{point.label}</th>
            <td>{formatCurrency(point.totalEarnings, currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EarningsChart({
  data,
  currency = "USD",
  variant = "area",
  height = 220,
  label,
  highlightMax = false,
}: {
  data: EarningsPoint[];
  currency?: CurrencyCode;
  variant?: "area" | "bar";
  height?: number;
  label: string;
  highlightMax?: boolean;
}) {
  const maxValue = Math.max(...data.map((point) => point.totalEarnings), 0);

  return (
    <figure className="m-0">
      <div style={{ height }} aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          {variant === "area" ? (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0b8f6a" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0b8f6a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ebe8e3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={AXIS_STYLE}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={AXIS_STYLE}
                width={56}
                tickFormatter={(value: number) =>
                  formatCurrencyCompact(value, currency)
                }
              />
              <Tooltip
                cursor={{ stroke: "#d8d4cd" }}
                content={<ChartTooltip currency={currency} />}
              />
              <Area
                type="monotone"
                dataKey="totalEarnings"
                stroke="#0b8f6a"
                strokeWidth={2.5}
                fill="url(#earningsFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid stroke="#ebe8e3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={AXIS_STYLE}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={AXIS_STYLE}
                width={56}
                tickFormatter={(value: number) =>
                  formatCurrencyCompact(value, currency)
                }
              />
              <Tooltip
                cursor={{ fill: "#f3f1ee" }}
                content={<ChartTooltip currency={currency} />}
              />
              <Bar dataKey="totalEarnings" radius={[8, 8, 0, 0]}>
                {data.map((point) => (
                  <Cell
                    key={point.key}
                    fill={
                      highlightMax &&
                      point.totalEarnings === maxValue &&
                      maxValue > 0
                        ? "#0b8f6a"
                        : "#bfe0d4"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <ChartTable data={data} currency={currency} caption={label} />
    </figure>
  );
}
