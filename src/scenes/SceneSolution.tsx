import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../Cursor";
import { C, F } from "../styles/colors";

const checks = [
  { label: "Design",  sub: "Individuell & modern",   delay: 45 },
  { label: "Hosting", sub: "Schnell & zuverlässig",  delay: 65 },
  { label: "Pflege",  sub: "Immer aktuell",           delay: 85 },
];

const CheckItem: React.FC<{ label: string; sub: string; delay: number }> = ({
  label,
  sub,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        marginBottom: 36,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px)`,
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: C.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 8px 24px ${C.accent}44`,
        }}
      >
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
          <path
            d="M2 9L8 15L20 3"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 52,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 20,
            color: C.dim,
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
};

export const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [108, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line1p = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const line2p = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 140 } });

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
      {/* Accent bar */}
      <div
        style={{
          width: interpolate(frame, [0, 20], [0, 80], { extrapolateRight: "clamp" }),
          height: 4,
          background: C.accent,
          borderRadius: 2,
          marginBottom: 40,
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontFamily: F.serif,
          fontSize: 78,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.05,
          opacity: line1p,
          transform: `translateY(${interpolate(line1p, [0, 1], [50, 0])}px)`,
          marginBottom: 4,
        }}
      >
        Genau dafür gibt es
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontSize: 96,
          fontWeight: 700,
          color: C.accent,
          lineHeight: 1.05,
          opacity: line2p,
          transform: `translateY(${interpolate(line2p, [0, 1], [50, 0])}px)`,
          marginBottom: 60,
          letterSpacing: "-0.02em",
        }}
      >
        Storefront
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: C.lines,
          marginBottom: 52,
          opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scaleX(${interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" })})`,
          transformOrigin: "left",
        }}
      />

      {/* Checklist */}
      <div>
        {checks.map((c) => (
          <CheckItem key={c.label} {...c} />
        ))}
      </div>

      {/*
        Check items: padding-left=80, circle diameter=56 → circle center x=80+28=108
        Content centered at y=960. Before items: bar+headline+divider ≈ 350px
        Items start at ≈ y=960-150=810 then:
          Design  circle center: y≈838
          Hosting circle center: y≈930  (838+56+36)
          Pflege  circle center: y≈1022 (930+56+36)
      */}
      <Cursor
        waypoints={[
          { x: 400, y: 900,  frame: 0  },  // idle above checklist
          { x: 108, y: 838,  frame: 38 },  // move to Design ✔
          { x: 108, y: 930,  frame: 58 },  // move to Hosting ✔
          { x: 108, y: 1022, frame: 78 },  // move to Pflege ✔
          { x: 108, y: 1022, frame: 120 }, // hold
        ]}
        clicks={[
          { frame: 45 },   // click Design
          { frame: 65 },   // click Hosting
          { frame: 85 },   // click Pflege
        ]}
        color={C.accent}
      />
    </div>
  );
};
