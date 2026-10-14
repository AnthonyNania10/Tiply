import { ArrowRight, Sparkles } from "lucide-react";

import { DashboardMockup } from "@/components/marketing/mockups/dashboard-mockup";
import { Reveal } from "@/components/marketing/reveal";
import { Container } from "@/components/marketing/section";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Single soft brand wash instead of layered gradients. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_40%,var(--color-brand-soft)_0%,transparent_70%)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-brand-dark backdrop-blur">
              <Sparkles aria-hidden className="h-3.5 w-3.5" />
              Built for servers, bartenders, valets &amp; casino floors
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-ink sm:text-6xl">
              Your Tips. Your Money.{" "}
              <span className="text-brand-dark">Your Bigger Picture.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
              Stop guessing how much you make. Tiply makes it easy to track your
              tips, monitor your earnings, and understand your income — all in
              one simple app.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/dashboard" size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight aria-hidden className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/#how-it-works"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                See How It Works
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-5 text-xs text-subtle">
              No account needed to try it — your data stays in your browser.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="mt-12 sm:mt-16">
          <DashboardMockup />
          <p className="mt-4 text-center text-xs text-subtle">
            Sample data shown for illustration.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
