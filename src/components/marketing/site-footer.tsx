import { Container } from "@/components/marketing/section";
import { HashLink } from "@/components/ui/hash-link";
import { Logo } from "@/components/logo";

const LINK_GROUPS = [
  {
    heading: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/dashboard", label: "Open the app" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "mailto:hello@tiply.app", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Logo href="/" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Tiply is an income tracker for people paid in tips. Log a shift in
              seconds, see what you actually earn per hour, and turn an
              unpredictable week into numbers you can plan around.
            </p>
            <p className="mt-4 text-sm font-medium text-brand-dark">
              Track your tips. Understand your income.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            {LINK_GROUPS.map((group) => (
              <div key={group.heading}>
                <h2 className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <HashLink
                        href={link.href}
                        className="rounded text-sm text-muted transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {link.label}
                      </HashLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tiply</p>
          <p>
            Early demo — your data stays in your browser. Tax figures are
            estimates, not tax advice.
          </p>
        </div>
      </Container>
    </footer>
  );
}
