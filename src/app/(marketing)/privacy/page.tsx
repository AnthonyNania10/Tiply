import type { Metadata } from "next";

import { Container } from "@/components/marketing/section";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tiply handles your data. In the current demo, your shifts and earnings never leave your browser.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-24">
      <LegalPage
        title="Privacy Policy"
        summary="Tiply is an early demo. It has no accounts, no servers storing your earnings, and no analytics on your shift data. Everything you log stays in your own browser."
      >
        <h2>What we store</h2>
        <p>
          Tiply currently runs entirely in your browser. The shifts you log, the
          workplaces you add, and your profile preferences are saved to your
          browser&apos;s local storage on your own device. They are not
          transmitted to us, and we cannot read them.
        </p>
        <p>
          Because the data lives on your device, clearing your browser storage
          or using a different browser or device will mean starting with an
          empty history. The &quot;Log out&quot; action in the app clears that
          local record.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not require an account, email address, or password.</li>
          <li>We do not connect to your bank, employer, or payroll system.</li>
          <li>We do not sell or share your earnings data, because we never receive it.</li>
        </ul>

        <h2>If that changes</h2>
        <p>
          A future version of Tiply is expected to offer optional accounts so
          your history can sync between devices. That would mean storing your
          data on a server. If and when it ships, it will be opt-in, this policy
          will be updated before it launches, and we will explain plainly what
          is stored and why.
        </p>

        <h2>Taxes</h2>
        <p>
          Any tax-related figure Tiply shows is a simple estimate for your own
          planning. It is not tax advice, and it does not account for brackets,
          withholding, deductions, or filing status. Please consult a qualified
          professional about your tax obligations.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can go to{" "}
          <a href="mailto:hello@tiply.app">hello@tiply.app</a>.
        </p>
      </LegalPage>
    </Container>
  );
}
