import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../Cursor";
import { C, F } from "../styles/colors";

const MockStorefrontHero: React.FC<{ scrollY: number }> = ({ scrollY }) => (
  <div
    style={{
      width: "100%",
      height: 620,
      background: C.bg,
      overflow: "hidden",
      position: "relative",
      transform: `translateY(${-scrollY}px)`,
    }}
  >
    {/* Nav */}
    <div
      style={{
        height: 56,
        borderBottom: `1px solid ${C.lines}`,
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontFamily: F.serif, fontSize: 20, fontWeight: 700, color: C.text }}>
        Storefront
      </span>
      <div style={{ display: "flex", gap: 28 }}>
        {["Wie es läuft", "Projekte", "Preise"].map((l) => (
          <span key={l} style={{ fontFamily: F.sans, fontSize: 13, color: C.dim }}>
            {l}
          </span>
        ))}
      </div>
      <div
        style={{
          background: C.accent,
          color: C.white,
          padding: "8px 20px",
          borderRadius: 6,
          fontFamily: F.sans,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Jetzt anfragen
      </div>
    </div>

    {/* Hero */}
    <div style={{ padding: "48px 40px 32px" }}>
      <div
        style={{
          fontFamily: F.sans,
          fontSize: 12,
          letterSpacing: "0.15em",
          color: C.accent,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Web-Design für Handwerker & Händler
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontSize: 52,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.1,
          marginBottom: 20,
        }}
      >
        Dein Betrieb verdient
        <br />
        eine bessere Website.
      </div>
      <div style={{ fontFamily: F.sans, fontSize: 16, color: C.dim, marginBottom: 32 }}>
        Wir bauen, pflegen und hosten deine Website —
        <br />
        damit du dich auf dein Geschäft konzentrieren kannst.
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            background: C.accent,
            color: C.white,
            padding: "14px 28px",
            borderRadius: 8,
            fontFamily: F.sans,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Jetzt anfragen
        </div>
        <div
          style={{
            border: `1.5px solid ${C.lines}`,
            color: C.text,
            padding: "14px 28px",
            borderRadius: 8,
            fontFamily: F.sans,
            fontSize: 15,
          }}
        >
          Projekte ansehen →
        </div>
      </div>
    </div>
  </div>
);

export const SceneWebsite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [50, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slideUp = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });

  const scrollY = interpolate(frame, [15, 45], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text1p = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 120 } });
  const text2p = spring({ frame: frame - 22, fps, config: { damping: 18, stiffness: 120 } });

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
      {/* Website screenshot */}
      <div
        style={{
          marginTop: 180,
          width: 900,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.14)",
          border: `1px solid ${C.lines}`,
          transform: `translateY(${interpolate(slideUp, [0, 1], [60, 0])}px)`,
          opacity: slideUp,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            height: 40,
            background: "#EDEBE8",
            borderBottom: `1px solid ${C.lines}`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => (
            <div key={col} style={{ width: 11, height: 11, borderRadius: "50%", background: col }} />
          ))}
          <div
            style={{
              marginLeft: 10,
              flex: 1,
              height: 24,
              borderRadius: 5,
              background: C.bg,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              fontFamily: F.sans,
              fontSize: 12,
              color: C.dim,
            }}
          >
            storefront.studio
          </div>
        </div>
        <MockStorefrontHero scrollY={scrollY} />
      </div>

      {/* Overlay text */}
      <div style={{ padding: "0 80px", marginTop: 64, width: "100%" }}>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 62,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.15,
            opacity: text1p,
            transform: `translateY(${interpolate(text1p, [0, 1], [24, 0])}px)`,
            marginBottom: 12,
          }}
        >
          Dein Betrieb sieht gut aus.
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            opacity: text2p,
            transform: `translateY(${interpolate(text2p, [0, 1], [24, 0])}px)`,
          }}
        >
          <span style={{ color: C.text }}>Deine Website sollte{" "}</span>
          <span style={{ color: C.accent }}>das zeigen.</span>
        </div>
      </div>

      <Cursor
        waypoints={[
          { x: 450, y: 800, frame: 0 },
          { x: 450, y: 820, frame: 15 },
          { x: 450, y: 860, frame: 30 },
          { x: 450, y: 840, frame: 50 },
        ]}
        color={C.text}
      />
    </div>
  );
};
