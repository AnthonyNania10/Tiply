"use client";

import { Banknote, ChevronRight, Clock, Plus, Receipt, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { EarningsChart } from "@/components/earnings-chart";
import { PageHeader } from "@/components/page-header";
import { ShiftCard } from "@/components/shift-card";
import { StatCard } from "@/components/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { LoadingScreen } from "@/components/ui/skeleton";
import { useTiply } from "@/hooks/use-tiply";
import {
  lastNDaysRange,
  thisMonthRange,
  thisYearRange,
  todayISO,
} from "@/lib/date";
import { filterByRange, summarize, weeklySeries } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";

const PERIODS = [
  { value: "month", label: "This month" },
  { value: "30d", label: "Last 30 days" },
  { value: "year", label: "This year" },
] as const;

type Period = (typeof PERIODS)[number]["value"];

export function DashboardView() {
  const { isLoading, shifts, profile, workplaceName } = useTiply();
  const [period, setPeriod] = useState<Period>("month");

  const today = todayISO();
  const range = useMemo(() => {
    if (period === "30d") return lastNDaysRange(30, today);
    if (period === "year") return thisYearRange(today);
    return thisMonthRange(today);
  }, [period, today]);

  const periodShifts = useMemo(
    () => filterByRange(shifts, range),
    [shifts, range],
  );
  const summary = useMemo(() => summarize(periodShifts), [periodShifts]);
  const chartData = useMemo(
    () =>
      weeklySeries(shifts, 8, today).map((point) => ({
        ...point,
        label: point.label.split(" – ")[0],
      })),
    [shifts, today],
  );

  if (isLoading) return <LoadingScreen label="Loading your dashboard" />;

  const periodLabel =
    PERIODS.find((option) => option.value === period)?.label ?? "This month";
  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Hey, ${firstName}`}
        description="Here's how your shifts are adding up."
        action={
          <ButtonLink href="/shifts/new" className="hidden lg:inline-flex">
            <Plus aria-hidden className="h-5 w-5" />
            Add Shift
          </ButtonLink>
        }
      />

      <SegmentedControl
        label="Earnings period"
        options={PERIODS}
        value={period}
        onChange={setPeriod}
      />

      <div className="space-y-3">
        <StatCard
          emphasis
          label={`Total earnings · ${periodLabel.toLowerCase()}`}
          value={formatCurrency(summary.totalEarnings, profile.currency)}
          caption={`${summary.shiftCount} shift${
            summary.shiftCount === 1 ? "" : "s"
          } logged`}
          icon={Wallet}
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Tips"
            value={formatCurrency(summary.tips, profile.currency)}
            caption={`${formatCurrency(summary.cashTips, profile.currency)} cash`}
            icon={Banknote}
          />
          <StatCard
            label="Hours worked"
            value={formatHours(summary.hoursWorked)}
            caption={`${formatCurrency(summary.basePay, profile.currency)} base pay`}
            icon={Clock}
          />
          <StatCard
            label="Average $/hour"
            value={formatCurrency(summary.averagePerHour, profile.currency)}
            caption="Tips plus wage"
            icon={TrendingUp}
          />
          <StatCard
            label="Average $/shift"
            value={formatCurrency(summary.averagePerShift, profile.currency)}
            caption="Across this period"
            icon={Wallet}
          />
        </div>
      </div>

      <ButtonLink href="/shifts/new" size="lg" className="w-full lg:hidden">
        <Plus aria-hidden className="h-5 w-5" />
        Add Shift
      </ButtonLink>

      <Card>
        <CardHeader
          title="Earnings trend"
          description="Total earnings per week, last 8 weeks."
        />
        <EarningsChart
          data={chartData}
          currency={profile.currency}
          label="Total earnings per week over the last 8 weeks"
        />
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Recent shifts</h2>
          <Link
            href="/shifts"
            className="flex items-center gap-1 rounded-full text-sm font-medium text-brand-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View all
            <ChevronRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        {shifts.length === 0 ? (
          <EmptyState
            title="No shifts yet"
            description="Log tonight's shift and Tiply will start building your income picture."
            action={<ButtonLink href="/shifts/new">Add your first shift</ButtonLink>}
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {shifts.slice(0, 6).map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                workplaceName={workplaceName(shift.workplaceId)}
                currency={profile.currency}
              />
            ))}
          </div>
        )}
      </section>

      <Link
        href="/tax-summary"
        className="flex items-center justify-between gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card transition hover:border-brand/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Receipt aria-hidden className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">
              Tax &amp; income summary
            </span>
            <span className="block text-xs text-muted">
              Year-to-date reported income and set-aside estimate.
            </span>
          </span>
        </span>
        <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-subtle" />
      </Link>
    </div>
  );
}
