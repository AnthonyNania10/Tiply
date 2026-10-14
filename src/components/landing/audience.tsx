import {
  Bike,
  CarFront,
  ConciergeBell,
  Dices,
  Martini,
  UtensilsCrossed,
} from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/reveal";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/section";

const PROFESSIONS = [
  {
    icon: UtensilsCrossed,
    title: "Restaurant servers",
    body: "Tables, sections, and split shifts that never earn the same twice.",
  },
  {
    icon: Martini,
    title: "Bartenders",
    body: "Busy weekends, quiet weeknights, and a tip jar to account for.",
  },
  {
    icon: CarFront,
    title: "Valet attendants",
    body: "Mostly cash, handed over a few dollars at a time.",
  },
  {
    icon: Dices,
    title: "Casino employees",
    body: "Toke rates and floor shifts that shift with the crowd.",
  },
  {
    icon: ConciergeBell,
    title: "Hotel bell staff",
    body: "Bags, airport runs, and a long day of small gratuities.",
  },
  {
    icon: Bike,
    title: "Delivery drivers",
    body: "Per-trip tips across platforms, plus the hours behind them.",
  },
];

export function Audience() {
  return (
    <Section id="who-its-for" labelledBy="audience-heading">
      <Container>
        <SectionHeading
          id="audience-heading"
          eyebrow="Who it's for"
          title="Built for People Who Earn Their Living in Tips."
          description="Tiply is designed for anyone whose income changes depending on the shift."
        />

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROFESSIONS.map((profession) => (
            <RevealItem key={profession.title}>
              <article className="flex h-full items-start gap-4 rounded-3xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-brand/25">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <profession.icon aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {profession.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {profession.body}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12">
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-pretty text-muted sm:text-lg">
            Whether you&apos;re working a few shifts a week or building a career
            in hospitality, Tiply helps you understand the money you work hard
            to earn.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
