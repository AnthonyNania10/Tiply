"use client";

import { Banknote, CalendarDays, TrendingUp, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import { TipMixChart } from "@/components/charts/tip-mix-chart";
import { EarningsChart } from "@/components/earnings-chart";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { LoadingScreen } from "@/components/ui/skeleton";
import { useTiply } from "@/hooks/use-tiply";
import { formatShiftDate, todayISO } from "@/lib/date";
import {
  bestShift,
  monthlySeries,
  shiftTotals,
  summarize,
  tipMix,
  weekdaySeries,
  weeklySeries,
} from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";

const GRANULARITY = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

type Granularity = (typeof GRANULARITY)[number]["value"];

export function AnalyticsView() {
  const { isLoading, shifts, profile, workplaceName } = useTiply();
  const [granularity, setGranularity] = useState<Granularity>("weekly");
  const today = todayISO();

  const incomeSeries = useMemo(() => {
    if (granularity === "monthly") return monthlySeries(shifts, 6, today);
    return weeklySeries(shifts, 10, today).map((point) => ({
      ...point,
      label: point.label.split(" – ")[0],
    }));
  }, [granularity, shifts, today]);

  const summary = useMemo(() => summarize(shifts), [shifts]);
  const byWeekday = useMemo(() => weekdaySeries(shifts), [shifts]);
  const mix = useMemo(() => tipMix(shifts), [shifts]);
  const best = useMemo(() => bestShift(shifts), [shifts]);

  if (isLoading) return <LoadingScreen label="Loading your analytics" />;

  const bestWeekday = byWeekday.reduce(
    (top, point) => (point.totalEarnings > top.totalEarnings ? point : top),
    byWeekday[0],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Income patterns"
        description="Placeholder visualizations built from your logged shifts."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Average $/shift"
          value={formatCurrency(summary.averagePerShift, profile.currency)}
          caption={`${summary.shiftCount} shifts tracked`}
          icon={Wallet}
        />
        <StatCard
          label="Average $/hour"
          value={formatCurrency(summary.averagePerHour, profile.currency)}
          caption={`${formatHours(summary.hoursWorked)} total`}
          icon={TrendingUp}
        />
        <StatCard
          label="Best day of week"
          value={bestWeekday?.label ?? "—"}
          caption={
            bestWeekday
              ? `${formatCurrency(bestWeekday.totalEarnings, profile.currency)} avg`
              : undefined
          }
          icon={CalendarDays}
        />
        <StatCard
          label="Cash share of tips"
          value={`${mix.cashShare}%`}
          caption={`${formatCurrency(mix.cash, profile.currency)} in cash`}
          icon={Banknote}
        />
      </div>

      <Card>
        <CardHeader
          title="Income over time"
          description={
            granularity === "weekly" ? "Last 10 weeks." : "Last 6 months."
          }
          action={
            <SegmentedControl
              label="Chart granularity"
              options={GRANULARITY}
              value={granularity}
              onChange={setGranularity}
              className="w-auto"
            />
          }
        />
        <EarningsChart
          data={incomeSeries}
          currency={profile.currency}
          label={`Total earnings per ${granularity === "weekly" ? "week" : "month"}`}
          height={240}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Highest-earning days"
            description="Average earnings per shift by day of week."
          />
          <EarningsChart
            data={byWeekday}
            currency={profile.currency}
            variant="bar"
            highlightMax
            label="Average earnings per shift by day of week"
            height={200}
          />
        </Card>

        <Card>
          <CardHeader
            title="Cash vs. card tips"
            description="All tips you've logged so far."
          />
          <TipMixChart mix={mix} currency={profile.currency} />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Best shift so far"
          description="Your single highest-earning night."
        />
        {best ? (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">
                {formatShiftDate(best.date)} · {workplaceName(best.workplaceId)}
              </p>
              <p className="text-xs text-muted">
                {formatHours(best.hoursWorked)} ·{" "}
                {formatCurrency(
                  shiftTotals(best).effectiveHourlyRate,
                  profile.currency,
                )}
                /hr effective
              </p>
            </div>
            <p className="tabular text-2xl font-semibold text-brand-dark">
              {formatCurrency(shiftTotals(best).totalEarnings, profile.currency)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">Log a shift to see your best night.</p>
        )}
      </Card>
    </div>
  );
}
