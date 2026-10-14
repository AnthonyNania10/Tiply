import { ArrowRight, Check, Clock3 } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/section";
import { Button, ButtonLink } from "@/components/ui/button";

const FREE_FEATURES = [
  "Basic shift tracking",
  "Cash and credit tip recording",
  "Income dashboard",
  "Shift history",
  "Basic earnings summaries",
];

const PREMIUM_FEATURES = [
  "Advanced income analytics",
  "Tax estimation tools",
  "Budgeting features",
  "Income exports",
  "Additional financial insights",
];

function FeatureList({
  features,
  planned = false,
}: {
  features: readonly string[];
  planned?: boolean;
}) {
  return (
    <ul className="mt-6 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm">
          <span
            aria-hidden
            className={
              planned
                ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-line text-subtle"
                : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"
            }
          >
            {planned ? (
              <Clock3 className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </span>
          <span className={planned ? "text-muted" : "text-ink"}>
            {feature}
            {planned ? <span className="sr-only"> (planned)</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Pricing() {
  return (
    <Section id="pricing" tone="surface" labelledBy="pricing-heading">
      <Container>
        <SectionHeading
          id="pricing-heading"
          eyebrow="Pricing"
          title="Start free. Premium is on the way."
          description="Everything you need to track shifts and understand your income is free to use today. A premium tier is planned, and its pricing has not been set yet."
        />

        <RevealGroup className="mx-auto mt-14 grid max-w-4xl gap-5 lg:grid-cols-2">
          <RevealItem>
            <article className="flex h-full flex-col rounded-3xl border-2 border-brand/25 bg-canvas/50 p-7 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">Tiply Free</h3>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
                  Available now
                </span>
              </div>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="tabular text-4xl font-semibold tracking-tight text-ink">
                  $0
                </span>
                <span className="text-sm text-muted">to get started</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                The core tracker: log your shifts and see what you earn.
              </p>

              <FeatureList features={FREE_FEATURES} />

              <div className="mt-8 pt-2">
                <ButtonLink href="/dashboard" size="lg" className="w-full">
                  Get Started
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
                <p className="mt-3 text-center text-xs text-subtle">
                  No account required — data stays in your browser.
                </p>
              </div>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="flex h-full flex-col rounded-3xl border border-line bg-canvas/30 p-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">
                  Tiply Premium
                </h3>
                <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                  Planned
                </span>
              </div>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-muted">
                  Pricing TBD
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Deeper analysis and planning tools. These features are not built
                yet — this is what we intend to add.
              </p>

              <FeatureList features={PREMIUM_FEATURES} planned />

              <div className="mt-8 pt-2">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  disabled
                >
                  Coming soon
                </Button>
                <p className="mt-3 text-center text-xs text-subtle">
                  Not available for purchase yet.
                </p>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </Container>
    </Section>
  );
}
