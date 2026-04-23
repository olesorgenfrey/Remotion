import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../Cursor";
import { C, F } from "../styles/colors";

const NAV_ITEMS = ["Wie es läuft", "Projekte", "Preise", "Jetzt anfragen"];
const NAV_X = [188, 340, 462, 620];
const NAV_Y = 56;

// frames when cursor hovers each item
const HOVER_FRAMES = [10, 35, 60, 90];
const CLICK_FRAMES = [18, 42, 68, 98];

function isHovered(itemIdx: number, frame: number): boolean {
  if (frame < HOVER_FRAMES[itemIdx]) return false;
  if (itemIdx < NAV_ITEMS.length - 1 && frame >= HOVER_FRAMES[itemIdx + 1]) return false;
  return true;
}

const MockNavBar: React.FC<{ frame: number; scrollProgress: number }> = ({
  frame,
  scrollProgress,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: C.bg,
      fontFamily: F.sans,
      overflow: "hidden",
    }}
  >
    {/* Nav */}
    <div
      style={{
        height: 56,
        borderBottom: `1px solid ${C.lines}`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: C.bg,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: F.serif,
          fontSize: 18,
          fontWeight: 700,
          color: C.text,
        }}
      >
        Storefront
      </span>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {NAV_ITEMS.slice(0, 3).map((item, i) => {
          const hovered = isHovered(i, frame);
          return (
            <span
              key={item}
              style={{
                fontFamily: F.sans,
                fontSize: 13,
                color: hovered ? C.accent : C.dim,
                borderBottom: hovered ? `1.5px solid ${C.accent}` : "1.5px solid transparent",
                paddingBottom: 2,
                transition: "color 0.1s",
              }}
            >
              {item}
            </span>
          );
        })}
      </div>

      {/* CTA button */}
      <div
        style={{
          background: isHovered(3, frame) ? "#A8421F" : C.accent,
          color: C.white,
          padding: "8px 18px",
          borderRadius: 6,
          fontFamily: F.sans,
          fontSize: 13,
          fontWeight: 600,
          transform: `scale(${isHovered(3, frame) ? 1.05 : 1})`,
          transition: "all 0.1s",
        }}
      >
        Jetzt anfragen
      </div>
    </div>

    {/* Scrollable content */}
    <div
      style={{
        transform: `translateY(${-scrollProgress * 80}px)`,
        padding: "32px 24px",
      }}
    >
      {/* Section: Wie es läuft */}
      <div
        style={{
          marginBottom: 40,
          padding: "24px",
          background: "#F8F4F0",
          borderRadius: 12,
          border: `1px solid ${C.lines}`,
        }}
      >
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: C.accent,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Wie es läuft
        </div>
        <div style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 10 }}>
          In 3 Schritten zur neuen Website
        </div>
        {["Gespräch buchen", "Wir bauen", "Du sparst Zeit"].map((s, i) => (
          <div
            key={s}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 8,
              fontFamily: F.sans,
              fontSize: 13,
              color: C.dim,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: C.accent,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            {s}
          </div>
        ))}
      </div>

      {/* Projects */}
      <div
        style={{
          fontFamily: F.sans,
          fontSize: 10,
          letterSpacing: "0.14em",
          color: C.accent,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Projekte
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        {["Schreinerei Wagner", "Bäckerei Müller", "Auto Renz"].map((p) => (
          <div
            key={p}
            style={{
              flex: 1,
              height: 80,
              background: "#EDE8E2",
              borderRadius: 8,
              display: "flex",
              alignItems: "flex-end",
              padding: "8px 10px",
              fontFamily: F.sans,
              fontSize: 11,
              color: C.text,
              fontWeight: 600,
              border: `1px solid ${C.lines}`,
            }}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Pricing teaser */}
      <div
        style={{
          padding: "20px",
          background: C.accent,
          borderRadius: 12,
          color: C.white,
          fontFamily: F.sans,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Preise</div>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: F.serif }}>
          Ab 49 € / Monat
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Alles inklusive · Keine Überraschungen
        </div>
      </div>
    </div>
  </div>
);

export const SceneNavigation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [138, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slideUp = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });

  const scrollProgress = interpolate(frame, [70, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor scale for website - nav items are at different pixel positions within the mock
  // Map nav positions into the full 1080px-wide container
  const windowLeft = 90; // margin of the browser window inside the scene
  const windowTop = 260; // vertical position of the window

  const waypoints = [
    { x: windowLeft + 40, y: windowTop + NAV_Y / 2, frame: 0 },
    ...HOVER_FRAMES.map((hf, i) => ({
      x: windowLeft + NAV_X[i],
      y: windowTop + NAV_Y / 2,
      frame: hf,
    })),
    { x: windowLeft + NAV_X[3], y: windowTop + NAV_Y / 2 + 4, frame: 105 },
  ];

  const clicks = CLICK_FRAMES.map((cf) => ({ frame: cf, duration: 10 }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Label */}
      <div
        style={{
          marginTop: 140,
          marginBottom: 24,
          fontFamily: F.sans,
          fontSize: 13,
          letterSpacing: "0.16em",
          color: C.accent,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Website Demo
      </div>

      {/* Browser window */}
      <div
        style={{
          width: 900,
          height: 680,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 28px 80px rgba(0,0,0,0.15)",
          border: `1px solid ${C.lines}`,
          opacity: slideUp,
          transform: `translateY(${interpolate(slideUp, [0, 1], [40, 0])}px)`,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            height: 38,
            background: "#EDEBE8",
            borderBottom: `1px solid ${C.lines}`,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 7,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => (
            <div key={col} style={{ width: 10, height: 10, borderRadius: "50%", background: col }} />
          ))}
          <div
            style={{
              marginLeft: 8,
              flex: 1,
              height: 22,
              borderRadius: 4,
              background: C.bg,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              fontFamily: F.sans,
              fontSize: 11,
              color: C.dim,
            }}
          >
            storefront.studio
          </div>
        </div>

        <div style={{ height: "calc(100% - 38px)", overflow: "hidden" }}>
          <MockNavBar frame={frame} scrollProgress={scrollProgress} />
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          marginTop: 48,
          padding: "0 80px",
          textAlign: "center",
          opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontFamily: F.serif, fontSize: 52, fontWeight: 700, color: C.text }}>
          Alles an einem Ort.
        </div>
      </div>

      <Cursor waypoints={waypoints} clicks={clicks} color={C.text} />
    </div>
  );
};
