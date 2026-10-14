import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages. Typographic styles are applied from here
 * rather than per-page so the two documents cannot drift apart, and so the
 * page bodies stay readable as plain prose.
 */
export function LegalPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-5 text-base leading-relaxed text-pretty text-muted">
        {summary}
      </p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted [&_a]:font-medium [&_a]:text-brand-dark [&_a]:underline [&_a]:underline-offset-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:pl-1 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}
