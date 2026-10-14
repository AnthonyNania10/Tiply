import {
  Banknote,
  ChartColumn,
  Clock,
  History,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/section";

const FEATURES = [
  {
    icon: Clock,
    title: "Easy Tip Tracking",
    body: "Record your earnings in seconds after each shift.",
  },
  {
    icon: LayoutDashboard,
    title: "Income Dashboard",
    body: "View daily, weekly, and monthly earnings in one place.",
  },
  {
    icon: ChartColumn,
    title: "Hourly Earnings Analysis",
    body: "Understand how much you're actually earning for every hour worked.",
  },
  {
    icon: History,
    title: "Shift History",
    body: "Keep a record of previous shifts and earnings.",
  },
  {
    icon: TrendingUp,
    title: "Income Trends",
    body: "Identify patterns and see how your income changes over time.",
  },
  {
    icon: Banknote,
    title: "Cash & Card Tip Tracking",
    body: "Keep cash and credit card tips organized without additional spreadsheets.",
  },
];

export function Features() {
  return (
    <Section id="features" tone="surface" labelledBy="features-heading">
      <Container>
        <SectionHeading
          id="features-heading"
          eyebrow="Features"
          title="Everything You Need to Understand Your Income."
          description="Every feature exists to answer one question: what are you actually earning?"
        />

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <RevealItem key={feature.title}>
              <article className="group h-full rounded-3xl border border-line bg-canvas/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-surface hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <feature.icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
