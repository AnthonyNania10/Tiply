"use client";

import { Banknote, CreditCard, Info, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { EarningsChart } from "@/components/earnings-chart";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingScreen } from "@/components/ui/skeleton";
import { useTiply } from "@/hooks/use-tiply";
import { thisYearRange, todayISO } from "@/lib/date";
import { estimatedSetAside, filterByRange, monthlySeries, summarize } from "@/lib/earnings";
import { formatCurrency } from "@/lib/format";

export function TaxView() {
  const { isLoading, shifts, profile } = useTiply();
  const today = todayISO();
  const year = today.slice(0, 4);

  const yearShifts = useMemo(
    () => filterByRange(shifts, thisYearRange(today)),
    [shifts, today],
  );
  const summary = useMemo(() => summarize(yearShifts), [yearShifts]);
  const byMonth = useMemo(
    () => monthlySeries(yearShifts, 6, today),
    [today, yearShifts],
  );

  if (isLoading) return <LoadingScreen label="Loading your income summary" />;

  const setAside = estimatedSetAside(
    summary.totalEarnings,
    profile.taxSetAsidePercent,
  );

  if (yearShifts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Tax & income"
          title={`${year} income summary`}
          description="A running total of what you've reported in Tiply this year."
        />
        <TaxDisclaimer />
        <EmptyState
          title="No reported income yet"
          description="Once you log a shift, Tiply will summarize your reported income and estimated set-aside here."
          action={<ButtonLink href="/shifts/new">Add your first shift</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tax & income"
        title={`${year} income summary`}
        description="A running total of what you've reported in Tiply this year."
      />

      <TaxDisclaimer />

      <div className="space-y-3">
        <StatCard
          emphasis
          label={`Reported income · ${year} to date`}
          value={formatCurrency(summary.totalEarnings, profile.currency)}
          caption={`${summary.shiftCount} shifts · ${formatCurrency(
            summary.basePay,
            profile.currency,
          )} base pay`}
          icon={Wallet}
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard
            label="Cash tips"
            value={formatCurrency(summary.cashTips, profile.currency)}
            caption="Self-reported"
            icon={Banknote}
          />
          <StatCard
            label="Card tips"
            value={formatCurrency(summary.cardTips, profile.currency)}
            caption="Usually on your paycheck"
            icon={CreditCard}
          />
          <StatCard
            label="Total tips"
            value={formatCurrency(summary.tips, profile.currency)}
            caption="Cash plus card"
            icon={Wallet}
          />
        </div>
      </div>

      <Card>
        <CardHeader
          title="Estimated taxes to set aside"
          description="A simple flat percentage of reported income."
        />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <PiggyBank aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <p className="tabular text-3xl font-semibold text-ink">
                {formatCurrency(setAside, profile.currency)}
              </p>
              <p className="text-xs text-muted">
                {profile.taxSetAsidePercent}% of {year} reported income ·{" "}
                <Link
                  href="/profile"
                  className="font-medium text-brand-dark hover:underline"
                >
                  change rate
                </Link>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-5 rounded-2xl border border-dashed border-line bg-canvas p-4 text-xs leading-relaxed text-subtle">
          Coming later: withholding already taken from your paycheck, federal
          and state brackets, self-employment tax for gig shifts, and quarterly
          payment reminders. For now this is a simple set-aside target.
        </p>
      </Card>

      <Card>
        <CardHeader
          title="Reported income by month"
          description="Last 6 months of logged earnings."
        />
        <EarningsChart
          data={byMonth}
          currency={profile.currency}
          variant="bar"
          label="Reported income by month"
          height={220}
        />
      </Card>
    </div>
  );
}

function TaxDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-caution/25 bg-caution/5 p-4">
      <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
      <p className="text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink">
          These are estimates, not tax advice.
        </span>{" "}
        Tiply does not file anything for you and does not know your filing
        status, deductions, or local rules. Talk to a tax professional before
        making decisions.
      </p>
    </div>
  );
}
