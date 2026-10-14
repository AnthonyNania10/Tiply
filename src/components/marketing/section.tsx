import type { ReactNode } from "react";

import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

/**
 * Shared horizontal rhythm. Marketing content is wider than the app's
 * `max-w-5xl` so the dashboard mockups have room to read as real screens.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  tone = "canvas",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "canvas" | "surface" | "ink";
  /** Ties the section to its heading for assistive technology. */
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-16 sm:py-24",
        tone === "surface" && "bg-surface",
        tone === "ink" && "bg-ink text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <Reveal
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.14em] uppercase",
            dark ? "text-brand" : "text-brand-dark",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "mt-3 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-pretty sm:text-lg",
            dark ? "text-white/70" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
