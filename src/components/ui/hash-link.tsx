"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Next.js client navigation to `/#id` from the same path does not reliably
 * scroll, and a hash click from a menu that is unmounting is even less
 * reliable. If the target is already in the document we scroll it ourselves;
 * otherwise the link behaves like a normal route change (e.g. Privacy → `/`).
 */
export function HashLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (typeof href !== "string" || !href.includes("#")) return;

    const id = href.slice(href.indexOf("#") + 1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", href);
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
