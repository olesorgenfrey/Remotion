import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const BrowserWindow: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div
      style={{
        width: 480,
        height: 300,
        border: "3px solid white",
        borderRadius: 12,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.85, 1])})`,
        overflow: "hidden",
      }}
    >
      {/* Browser bar */}
      <div
        style={{
          height: 40,
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: 18,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 9,
            marginLeft: 8,
          }}
        />
      </div>
      {/* Page skeleton */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ height: 20, width: "60%", background: "rgba(255,255,255,0.3)", borderRadius: 4 }} />
        <div style={{ height: 12, width: "90%", background: "rgba(255,255,255,0.15)", borderRadius: 4 }} />
        <div style={{ height: 12, width: "75%", background: "rgba(255,255,255,0.15)", borderRadius: 4 }} />
        <div style={{ height: 80, width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: 8, marginTop: 8 }} />
      </div>
    </div>
  );
};

export const WebAgencyIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title fades + slides in at frame 10
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(frame, [10, 35], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Tagline fades in at frame 40
  const tagOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Browser window appears at frame 65
  const browserProgress = interpolate(frame, [65, 90], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Divider line grows at frame 55
  const lineWidth = interpolate(frame, [55, 75], [0, 200], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Left: text */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          We Build
          <br />
          Websites.
        </div>

        <div
          style={{
            width: lineWidth,
            height: 3,
            background: "#6c63ff",
            borderRadius: 2,
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        <div
          style={{
            opacity: tagOpacity,
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 300,
            letterSpacing: 1,
          }}
        >
          Fast. Clean. Modern.
        </div>
      </div>

      {/* Right: browser mockup */}
      <BrowserWindow progress={browserProgress} />
    </AbsoluteFill>
  );
};
