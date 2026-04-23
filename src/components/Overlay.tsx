import React from "react";
import { interpolate, spring, useCurrentFrame, Easing } from "remotion";
import { P } from "./palette";

// ─── FLOATING LABEL ──────────────────────────────────────────────────────────

const FloatLabel: React.FC<{
  children: React.ReactNode;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  delay: number;
  accent?: boolean;
}> = ({ children, top, bottom, left, right, delay, accent }) => {
  const frame = useCurrentFrame();

  const p = spring({
    frame: frame - delay,
    fps: 60,
    config: { damping: 22, stiffness: 140 },
  });
  const opacity = interpolate(p, [0, 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(p, [0, 1], [12, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 10.5,
        letterSpacing: "0.1em",
        color: accent ? P.accent : P.mutedLight,
        textTransform: "uppercase" as const,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
};

// ─── CORNER DECORATION ───────────────────────────────────────────────────────

const Corner: React.FC<{
  position: "tl" | "tr" | "bl" | "br";
  delay: number;
}> = ({ position, delay }) => {
  const frame = useCurrentFrame();
  const p = spring({
    frame: frame - delay,
    fps: 60,
    config: { damping: 20, stiffness: 160 },
  });
  const opacity = interpolate(p, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const size = interpolate(p, [0, 1], [0, 18]);

  const isTop = position.startsWith("t");
  const isLeft = position.endsWith("l");
  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    opacity: opacity * 0.45,
    top: isTop ? 32 : undefined,
    bottom: !isTop ? 32 : undefined,
    left: isLeft ? 32 : undefined,
    right: !isLeft ? 32 : undefined,
    borderTop: isTop ? `1.5px solid ${P.accent}` : undefined,
    borderBottom: !isTop ? `1.5px solid ${P.accent}` : undefined,
    borderLeft: isLeft ? `1.5px solid ${P.accent}` : undefined,
    borderRight: !isLeft ? `1.5px solid ${P.accent}` : undefined,
  } as React.CSSProperties;

  return <div style={style} />;
};

// ─── FRAME COUNTER ───────────────────────────────────────────────────────────

const FrameCounter: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - delay, fps: 60, config: { damping: 20, stiffness: 160 } });
  const opacity = interpolate(p, [0, 0.4], [0, 0.35], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        right: 60,
        opacity,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 10,
        color: P.muted,
        letterSpacing: "0.12em",
        pointerEvents: "none",
      }}
    >
      {String(frame).padStart(4, "0")}
    </div>
  );
};

// ─── HORIZONTAL RULE ─────────────────────────────────────────────────────────

const GlowRule: React.FC<{ y: string | number; delay: number }> = ({ y, delay }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - delay, fps: 60, config: { damping: 25, stiffness: 180 } });
  const scaleX = interpolate(p, [0, 1], [0, 1]);
  const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        height: 1,
        opacity: opacity * 0.18,
        transform: `scaleX(${scaleX})`,
        transformOrigin: "left center",
        background: `linear-gradient(90deg, transparent 0%, ${P.accent} 30%, ${P.accentOrange} 70%, transparent 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── MAIN OVERLAY ────────────────────────────────────────────────────────────

export const Overlay: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  return (
    <>
      <Corner position="tl" delay={startFrame + 10} />
      <Corner position="tr" delay={startFrame + 20} />
      <Corner position="bl" delay={startFrame + 30} />
      <Corner position="br" delay={startFrame + 40} />

      <FloatLabel top={38} left={64} delay={startFrame + 15}>
        © Simplicissimus · Motion
      </FloatLabel>

      <FloatLabel top={38} right={64} delay={startFrame + 25} accent>
        Remotion 4.0
      </FloatLabel>

      <FloatLabel bottom={38} left={64} delay={startFrame + 35}>
        1920 × 1080 · 60fps
      </FloatLabel>

      <GlowRule y="96px" delay={startFrame + 5} />
      <GlowRule y="calc(100% - 96px)" delay={startFrame + 8} />

      <FrameCounter delay={startFrame + 50} />
    </>
  );
};
