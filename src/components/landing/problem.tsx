import { CalendarX, HelpCircle, Waves } from "lucide-react";

import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/marketing/reveal";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/section";
import { SAMPLE_SWING, sampleWorkplaceName } from "@/data/landing-sample";
import { formatShiftDate } from "@/lib/date";
import { shiftTotals } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";

const PROBLEMS = [
  {
    icon: Waves,
    title: "Unpredictable Income",
    body: "Your earnings change from shift to shift, making it difficult to know what you're actually bringing home.",
  },
  {
    icon: HelpCircle,
    title: "No Clear Financial Picture",
    body: "Cash tips, card tips, and different hours worked make it challenging to calculate your true income.",
  },
  {
    icon: CalendarX,
    title: "Difficult Financial Planning",
    body: "Without understanding your average earnings, budgeting and saving can feel like guesswork.",
  },
];

/** A good night and a bad night side by side, pulled from the sample history. */
function SwingComparison() {
  const nights = [
    { shift: SAMPLE_SWING.high, tone: "high" as const, caption: "A good Friday" },
    { shift: SAMPLE_SWING.low, tone: "low" as const, caption: "A slow Monday" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {nights.map(({ shift, tone, caption }) => {
        const totals = shiftTotals(shift);
        return (
          <div
            key={shift.id}
            className={
              tone === "high"
                ? "rounded-3xl border border-brand/20 bg-brand-soft p-5"
                : "rounded-3xl border border-line bg-surface p-5"
            }
          >
            <p
              className={
                tone === "high"
                  ? "text-xs font-medium text-brand-dark"
                  : "text-xs font-medium text-muted"
              }
            >
              {caption}
            </p>
            <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-ink">
              {formatCurrency(totals.tips, "USD", { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-subtle">in tips</p>
            <dl className="mt-4 space-y-1.5 border-t border-line/70 pt-3 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{formatShiftDate(shift.date)}</dt>
                <dd className="truncate text-subtle">
                  {sampleWorkplaceName(shift.workplaceId)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Hours worked</dt>
                <dd className="tabular text-ink">
                  {formatHours(shift.hoursWorked)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Earned per hour</dt>
                <dd className="tabular font-semibold text-ink">
                  {formatCurrency(totals.effectiveHourlyRate)}
                </dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}

export function Problem() {
  return (
    <Section id="problem" tone="surface" labelledBy="problem-heading">
      <Container>
        <SectionHeading
          id="problem-heading"
          eyebrow="The problem"
          title={
            <>
              Your Income Changes Every Shift. Tracking It Shouldn&apos;t Be
              Complicated.
            </>
          }
          description="Salaried workers know what lands in their account every month. Tipped workers don't. One Friday can be triple a slow Monday, and without a record of it there is no way to know what an average week really looks like."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal direction="left">
            <SwingComparison />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Same job, same person, same week — and{" "}
              <strong className="font-semibold text-ink">
                {formatCurrency(
                  shiftTotals(SAMPLE_SWING.high).tips -
                    shiftTotals(SAMPLE_SWING.low).tips,
                  "USD",
                  { maximumFractionDigits: 0 },
                )}
              </strong>{" "}
              between two shifts. Multiply that across a month and a guess stops
              being good enough.
            </p>
          </Reveal>

          <RevealGroup className="space-y-4">
            {PROBLEMS.map((problem) => (
              <RevealItem key={problem.title}>
                <article className="flex gap-4 rounded-3xl border border-line bg-canvas/60 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-brand shadow-card">
                    <problem.icon aria-hidden className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">
                      {problem.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {problem.body}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal className="mt-14">
          <p className="mx-auto max-w-2xl text-center text-xl font-semibold tracking-tight text-balance text-ink sm:text-2xl">
            Tiply turns unpredictable tips into understandable income.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
