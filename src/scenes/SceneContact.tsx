import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../Cursor";
import { C, F } from "../styles/colors";

const ICONS = [
  {
    label: "Anrufen",
    delay: 10,
    cursorY: 1020,
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M5 5C5 5 7 7 7 11C7 14 5 16 5 16C5 16 9 20 12 20C12 20 14 18 17 18C21 18 23 20 23 20C23 20 24 17 22 15C20 13 18 13 18 13L15 16C13 15 10 12 9 10L12 7C12 7 12 5 10 3C8 1 5 5 5 5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    delay: 28,
    cursorY: 1160,
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M10 18L11 14C11 14 13 16 14 16C16 16 18 13 18 11C18 9 16 8 14 9C12 10 11 12 11 14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "E-Mail",
    delay: 46,
    cursorY: 1300,
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 9L14 16L24 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const ContactIcon: React.FC<{
  label: string;
  delay: number;
  active: boolean;
  svg: React.ReactNode;
}> = ({ label, delay, active, svg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const hoverScale = active ? 1.08 : 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        marginBottom: 32,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px) scale(${hoverScale})`,
        transformOrigin: "left center",
        padding: "20px 28px",
        borderRadius: 16,
        background: active ? `${C.accent}12` : "transparent",
        border: `1.5px solid ${active ? C.accent : C.lines}`,
        transition: "background 0.15s, border 0.15s",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: active ? C.accent : "#EDE8E2",
          color: active ? C.white : C.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: active ? `0 8px 24px ${C.accent}44` : "none",
        }}
      >
        {svg}
      </div>
      <div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 22,
            fontWeight: 600,
            color: active ? C.accent : C.text,
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 15, color: C.dim, marginTop: 2 }}>
          {label === "Anrufen" && "+49 123 456 789"}
          {label === "WhatsApp" && "Schreib uns direkt"}
          {label === "E-Mail" && "hello@storefront.studio"}
        </div>
      </div>
    </div>
  );
};

export const SceneContact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [108, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleP = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });

  const subtitleP = spring({
    frame: frame - 60,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const activeIcon = frame >= 55 ? 0 : -1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Headline */}
      <div
        style={{
          fontFamily: F.sans,
          fontSize: 13,
          letterSpacing: "0.16em",
          color: C.accent,
          textTransform: "uppercase",
          marginBottom: 16,
          opacity: titleP,
        }}
      >
        So erreichst du uns
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontSize: 72,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.05,
          marginBottom: 52,
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [30, 0])}px)`,
        }}
      >
        In wenigen Minuten
        <br />
        <span style={{ color: C.accent }}>erreichbar.</span>
      </div>

      {/* Icons */}
      {ICONS.map((icon) => (
        <ContactIcon
          key={icon.label}
          label={icon.label}
          delay={icon.delay}
          active={icon.label === "Anrufen" && frame >= 55}
          svg={icon.svg}
        />
      ))}

      {/* Bottom text */}
      <div
        style={{
          marginTop: 40,
          fontFamily: F.sans,
          fontSize: 18,
          color: C.dim,
          opacity: subtitleP,
          transform: `translateY(${interpolate(subtitleP, [0, 1], [16, 0])}px)`,
        }}
      >
        Keine langen Wartezeiten. Keine Formulare.
      </div>

      <Cursor
        waypoints={[
          { x: 80, y: 900, frame: 0 },
          { x: 140, y: 1010, frame: 12 },
          { x: 280, y: 1020, frame: 30 },
          { x: 200, y: 1020, frame: 55 },
        ]}
        clicks={[{ frame: 55, duration: 14 }]}
        color={C.text}
      />
    </div>
  );
};
