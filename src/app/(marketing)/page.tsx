import type { Metadata } from "next";

import { Audience } from "@/components/landing/audience";
import { Clarity } from "@/components/landing/clarity";
import { Features } from "@/components/landing/features";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Problem } from "@/components/landing/problem";

export const metadata: Metadata = {
  title: "Tiply — Track your tips. Understand your income.",
  description:
    "Tiply is an income tracker for tipped workers. Log your shifts, track cash and card tips, and understand what you really earn per hour.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Audience />
      <Clarity />
      <Pricing />
      <FinalCta />
    </>
  );
}
