import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { Container, Section } from "@/components/marketing/section";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <Section labelledBy="final-cta-heading" className="pb-20 sm:pb-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(11,143,106,0.45)_0%,transparent_70%)]"
            />
            <div className="relative">
              <h2
                id="final-cta-heading"
                className="mx-auto max-w-2xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-white sm:text-5xl"
              >
                Every Tip Counts. Start Tracking Yours.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
                Take the guesswork out of your income and start understanding
                what you earn.
              </p>
              <div className="mt-9 flex justify-center">
                <ButtonLink href="/shifts/new" size="lg">
                  Get Started with Tiply
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
              </div>
              <p className="mt-5 text-xs text-white/50">
                Free to use · No account required · Your data stays on your
                device
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
