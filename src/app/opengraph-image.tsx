import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Uses system-stack fonts rather than fetching a webfont so the
 * image can be generated without a network round trip at build time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf9f7",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "#0b8f6a",
              color: "#ffffff",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#1a1a19" }}>
            Tiply
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#1a1a19",
              maxWidth: 900,
            }}
          >
            Your Tips. Your Money. Your Bigger Picture.
          </div>
          <div style={{ fontSize: 34, color: "#6f6a64", maxWidth: 820 }}>
            {SITE.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Cash & card tips", "Real hourly rate", "Shift history"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  fontSize: 26,
                  color: "#07674d",
                  backgroundColor: "#e6f4ef",
                  borderRadius: 999,
                  padding: "12px 28px",
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
