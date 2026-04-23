import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../styles/colors";

const StorefrontLogo: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => (
  <div
    style={{
      opacity,
      transform: `scale(${scale})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}
  >
    {/* Logomark */}
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 18,
        background: C.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 16px 40px ${C.accent}55`,
      }}
    >
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect x="5" y="5" width="10" height="24" rx="2" fill="white" opacity="0.9" />
        <rect x="19" y="5" width="10" height="16" rx="2" fill="white" opacity="0.6" />
        <rect x="19" y="25" width="10" height="4" rx="2" fill="white" opacity="0.9" />
      </svg>
    </div>
    {/* Wordmark */}
    <div
      style={{
        fontFamily: F.serif,
        fontSize: 32,
        fontWeight: 700,
        color: C.text,
        letterSpacing: "-0.01em",
      }}
    >
      Storefront
    </div>
  </div>
);

export const SceneFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [108, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line1p = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const line2p = spring({ frame: frame - 14, fps, config: { damping: 16, stiffness: 130 } });
  const logop  = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 120 } });
  const ctap   = spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 140 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * fadeOut,
        gap: 0,
      }}
    >
      {/* Main headline */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 100,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.0,
            opacity: line1p,
            transform: `translateY(${interpolate(line1p, [0, 1], [60, 0])}px)`,
            letterSpacing: "-0.02em",
          }}
        >
          Deine Website.
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 100,
            fontWeight: 700,
            color: C.accent,
            lineHeight: 1.0,
            opacity: line2p,
            transform: `translateY(${interpolate(line2p, [0, 1], [60, 0])}px)`,
            letterSpacing: "-0.02em",
          }}
        >
          Ohne Stress.
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: interpolate(logop, [0, 1], [0, 160]),
          height: 1,
          background: C.lines,
          marginBottom: 48,
        }}
      />

      {/* Logo */}
      <StorefrontLogo
        scale={interpolate(logop, [0, 1], [0.8, 1])}
        opacity={logop}
      />

      {/* CTA */}
      <div
        style={{
          marginTop: 64,
          opacity: ctap,
          transform: `translateY(${interpolate(ctap, [0, 1], [20, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            background: C.accent,
            color: C.white,
            padding: "20px 52px",
            borderRadius: 12,
            fontFamily: F.sans,
            fontSize: 20,
            fontWeight: 600,
            boxShadow: `0 12px 36px ${C.accent}44`,
            letterSpacing: "0.01em",
          }}
        >
          15 Minuten Gespräch buchen
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 15,
            color: C.dim,
          }}
        >
          storefront.studio
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: C.accent,
          opacity: ctap,
          transform: `scaleX(${interpolate(ctap, [0, 1], [0, 1])})`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
};
