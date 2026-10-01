import {
  ChartColumn,
  Clock,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Clock,
    title: "Log a shift in seconds",
    body: "Date and workplace are prefilled. Punch in hours, cash tips, and card tips, then save — most nights take under 20 seconds.",
  },
  {
    icon: ChartColumn,
    title: "See your real hourly",
    body: "Tips plus base wage, divided by the hours you actually worked. Find out which nights and sections are worth showing up for.",
  },
  {
    icon: Receipt,
    title: "Be ready at tax time",
    body: "Running totals of reported income and a cash-versus-card breakdown, so nothing is a surprise in April.",
  },
];

const STATS = [
  { label: "Avg. logging time", value: "18s" },
  { label: "Fields per shift", value: "5" },
  { label: "Built for", value: "Tipped work" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Logo href="/" />
        <div className="flex items-center gap-2">
          <ButtonLink href="/dashboard" variant="ghost" size="sm">
            Log In
          </ButtonLink>
          <ButtonLink href="/shifts/new" size="sm" className="hidden sm:inline-flex">
            Get Started
          </ButtonLink>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="py-12 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark">
            <Sparkles aria-hidden className="h-3.5 w-3.5" />
            For servers, bartenders, valets &amp; casino floors
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Know what you make.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Tiply is a tip tracker for people paid in cash and card tips. Record
            every shift in seconds, watch your real hourly rate take shape, and
            walk into tax season knowing exactly what you earned.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" size="lg" className="sm:w-auto">
              Get Started
            </ButtonLink>
            <ButtonLink href="/dashboard" size="lg" variant="secondary">
              Log In
            </ButtonLink>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-subtle">{stat.label}</dt>
                <dd className="tabular mt-1 text-xl font-semibold text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid gap-4 pb-12 sm:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-line bg-surface p-6 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-ink">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mb-16 rounded-3xl border border-line bg-surface p-8 shadow-card sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Your shifts, your numbers.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Tiply never connects to your bank or your employer&apos;s payroll.
                You log what you earned, and it stays yours.
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs text-subtle">
                <ShieldCheck aria-hidden className="h-4 w-4 text-brand" />
                Tax figures are estimates, not tax advice.
              </p>
            </div>
            <ButtonLink href="/shifts/new" size="lg">
              <Wallet aria-hidden className="h-5 w-5" />
              Log your first shift
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-subtle">
          <span>© {new Date().getFullYear()} Tiply</span>
          <span>MVP demo — browser-stored data, no account required.</span>
        </div>
      </footer>
    </div>
  );
}
