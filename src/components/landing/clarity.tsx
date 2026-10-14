import { CalendarCheck, Clock, TrendingUp, Wallet } from "lucide-react";

import { AnalyticsMockup } from "@/components/marketing/mockups/analytics-mockup";
import { Reveal } from "@/components/marketing/reveal";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/section";
import { SAMPLE_BEST_WEEKDAY, SAMPLE_METRICS } from "@/data/landing-sample";
import { formatCurrency } from "@/lib/format";

const { month } = SAMPLE_METRICS;

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    label: "Monthly earnings",
    value: formatCurrency(month.totalEarnings),
  },
  {
    icon: Wallet,
    label: "Average per shift",
    value: formatCurrency(month.averagePerShift),
  },
  {
    icon: Clock,
    label: "Average per hour",
    value: formatCurrency(month.averagePerHour),
  },
  {
    icon: CalendarCheck,
    label: "Highest-earning day",
    value: SAMPLE_BEST_WEEKDAY.label,
  },
];

export function Clarity() {
  return (
    <Section id="clarity" tone="ink" labelledBy="clarity-heading">
      <Container>
        <SectionHeading
          id="clarity-heading"
          eyebrow="Financial clarity"
          title="Know What You Make. Plan What's Next."
          description="When your income changes every day, understanding your earnings is the first step toward better financial decisions. Tiply gives you the information you need to recognize trends, estimate your income, and plan with more confidence."
          tone="dark"
        />

        <Reveal className="mt-12">
          <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
            {HIGHLIGHTS.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <highlight.icon
                  aria-hidden
                  className="h-4 w-4 text-brand"
                />
                <dt className="mt-2.5 text-xs text-white/60">
                  {highlight.label}
                </dt>
                <dd className="tabular mt-1 text-xl font-semibold tracking-tight text-white">
                  {highlight.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <AnalyticsMockup />
          <p className="mt-4 text-center text-xs text-white/50">
            Sample data shown for illustration. Hover the chart to explore a
            week.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
