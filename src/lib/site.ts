/**
 * Canonical site metadata.
 *
 * `metadataBase` has to be absolute for Next to resolve canonical URLs and
 * social images, so the deployment URL is read from the environment with a
 * sensible production fallback. Vercel exposes the former automatically.
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const SITE = {
  name: "Tiply",
  tagline: "Track your tips. Understand your income.",
  description:
    "Tiply is an income tracker for tipped workers. Log your shifts, track cash and card tips, and understand what you really earn per hour.",
  url: fromEnv ?? "https://tiply.app",
} as const;
