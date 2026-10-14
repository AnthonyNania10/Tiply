import type { Metadata } from "next";

import { Container } from "@/components/marketing/section";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply to using the Tiply demo, including what it is and what it is not.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <LegalPage
        title="Terms of Service"
        summary="Tiply is an early demo provided free of charge. These terms explain what you can expect from it, and what you should not rely on it for."
      >
        <h2>What Tiply is</h2>
        <p>
          Tiply is a tool for recording your own shifts and tips so you can see
          what you earn. You enter the numbers; Tiply adds them up and shows you
          summaries and averages based on what you entered.
        </p>

        <h2>Current status</h2>
        <p>
          This is a pre-release demo. It stores your data in your browser rather
          than on a server, features may change or be removed, and features
          described as planned or coming soon are not available yet and are not
          promised. Nothing on this site should be read as a commitment to ship
          a particular feature or price.
        </p>

        <h2>Your data and your responsibility</h2>
        <p>
          Because your history is kept in your browser&apos;s local storage, it
          can be lost if you clear your browser data, use private browsing, or
          switch devices. Tiply is not a system of record. Please keep your own
          copies of anything you need for employment, lending, or tax purposes.
        </p>
        <p>
          The accuracy of every figure depends on what you enter. Tiply cannot
          verify your hours, wage, or tips.
        </p>

        <h2>Not financial or tax advice</h2>
        <p>
          Tiply&apos;s summaries, averages, and any tax set-aside estimate are
          informational only. They are not financial, accounting, legal, or tax
          advice, and they do not account for brackets, withholding, deductions,
          or filing status. Consult a qualified professional before making
          decisions based on them.
        </p>

        <h2>Provided as is</h2>
        <p>
          Tiply is provided without warranties of any kind, to the extent
          permitted by law. We are not liable for losses arising from reliance
          on its calculations or from data lost from your browser.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Please use Tiply for tracking your own earnings, and do not attempt to
          disrupt the service or use it to misrepresent income to a third party.
        </p>

        <h2>Changes</h2>
        <p>
          These terms will be updated as Tiply develops, particularly if
          accounts or paid plans are introduced. Continuing to use Tiply after
          an update means accepting the revised terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions can go to{" "}
          <a href="mailto:hello@tiply.app">hello@tiply.app</a>.
        </p>
      </LegalPage>
    </Container>
  );
}
