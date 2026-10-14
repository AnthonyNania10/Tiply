import { BarChart3, Check, Lightbulb, PlusCircle } from "lucide-react";
import type { ReactNode } from "react";

import {
  InsightsMockup,
  LogShiftMockup,
  TrackIncomeMockup,
} from "@/components/marketing/mockups/step-mockups";
import { Reveal } from "@/components/marketing/reveal";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/section";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  icon: typeof PlusCircle;
  title: string;
  body: string;
  points: string[];
  closing: string;
  mockup: ReactNode;
}

const STEPS: Step[] = [
  {
    number: 1,
    icon: PlusCircle,
    title: "Log Your Shift",
    body: "After finishing work, enter a few simple details.",
    points: [
      "Date of your shift",
      "Hours worked",
      "Cash tips earned",
      "Credit card tips earned",
    ],
    closing: "Tiply automatically calculates your recorded earnings.",
    mockup: <LogShiftMockup />,
  },
  {
    number: 2,
    icon: BarChart3,
    title: "Track Your Income",
    body: "Your dashboard organizes your earnings into easy-to-understand summaries. See how much you've made:",
    points: ["Today", "This week", "This month", "Over time"],
    closing:
      "No spreadsheets, calculators, or complicated financial software required.",
    mockup: <TrackIncomeMockup />,
  },
  {
    number: 3,
    icon: Lightbulb,
    title: "Understand Your Earnings",
    body: "Discover useful insights about your work. Understand:",
    points: [
      "Your average hourly earnings",
      "Your highest-earning shifts",
      "Income trends over time",
      "Your average earnings per shift",
      "Which days tend to be most profitable",
    ],
    closing:
      "The goal is to help workers make better-informed financial decisions.",
    mockup: <InsightsMockup />,
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-it-works-heading">
      <Container>
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="How Tiply works"
          title="Three steps from a finished shift to a clear picture."
          description="Logging takes seconds. Everything after that happens on its own."
        />

        <div className="mt-16 space-y-16 sm:space-y-24">
          {STEPS.map((step, index) => {
            const mockupFirst = index % 2 === 1;
            return (
              <div
                key={step.number}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal
                  direction={mockupFirst ? "right" : "left"}
                  className={cn(mockupFirst && "lg:order-2")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-white shadow-raised"
                    >
                      {step.number}
                    </span>
                    <span className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    <step.icon aria-hidden className="h-6 w-6 text-brand" />
                    {step.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {step.body}
                  </p>

                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2.5 text-sm text-ink"
                      >
                        <span
                          aria-hidden
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 border-l-2 border-brand/30 pl-4 text-sm leading-relaxed font-medium text-brand-dark">
                    {step.closing}
                  </p>
                </Reveal>

                <Reveal
                  direction={mockupFirst ? "left" : "right"}
                  className={cn(mockupFirst && "lg:order-1")}
                >
                  {step.mockup}
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
