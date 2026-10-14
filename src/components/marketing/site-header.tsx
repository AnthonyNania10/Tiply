"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/logo";
import { HashLink } from "@/components/ui/hash-link";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Absolute `/#id` targets rather than bare `#id`, so the same header works on
 * the legal pages without the links resolving against the wrong path.
 */
const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#who-its-for", label: "Who it's for" },
  { href: "/#pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile menu is a dialog in spirit, so Escape has to dismiss it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "relative sticky top-0 z-50 transition-colors duration-300",
        // `relative` lets the mobile menu overlay the page instead of pushing
        // it down, so in-page hash links still land under the sticky header.
        scrolled || menuOpen
          ? "border-b border-line bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 sm:py-4">
        <Logo href="/" />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <HashLink
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {link.label}
            </HashLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/dashboard"
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Open the app
          </ButtonLink>
          <ButtonLink href="/dashboard" size="sm">
            Get Started
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="marketing-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="h-5 w-5" />
            ) : (
              <Menu aria-hidden className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            id="marketing-mobile-menu"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-card lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8"
            >
              {NAV_LINKS.map((link) => (
                <HashLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {link.label}
                </HashLink>
              ))}
              <HashLink
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:hidden"
              >
                Open the app
              </HashLink>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
