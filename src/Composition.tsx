import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fadeIn = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideUp = (frame: number, start: number, dur: number, dist = 60) =>
  interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// ─── CINEMATIC COMPONENTS ─────────────────────────────────────────────────────

const CinematicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#020617", overflow: "hidden" }}>
      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Animated Glows */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.01) * 20}% ${50 + Math.cos(frame * 0.01) * 20}%, rgba(108, 99, 255, 0.1) 0%, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const IDEWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}> = ({ children, title = "index.ts", style }) => {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(16px)",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: 36,
          background: "rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "rgba(255, 255, 255, 0.3)", fontFamily: "monospace", marginRight: 30 }}>
          {title}
        </div>
      </div>
      <div style={{ flex: 1, padding: 20, position: "relative" }}>{children}</div>
    </div>
  );
};

const TypingCode: React.FC<{ code: string[]; startFrame: number }> = ({ code, startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);
  const totalChars = code.join("\n").length;
  const charsToShow = Math.floor(interpolate(relativeFrame, [0, 60], [0, totalChars], { extrapolateRight: "clamp" }));

  let count = 0;
  return (
    <div style={{ fontFamily: "monospace", fontSize: 16, lineHeight: 1.5, color: "#e2e8f0" }}>
      {code.map((line, i) => {
        const lineStart = count;
        count += line.length + 1;
        if (charsToShow <= lineStart) return null;
        const text = line.substring(0, Math.min(line.length, charsToShow - lineStart));
        return (
          <div key={i} style={{ whiteSpace: "pre" }}>
            <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 15 }}>{i + 1}</span>
            {text}
          </div>
        );
      })}
    </div>
  );
};

// ─── ORIGINAL COMPONENTS (ADAPTED) ────────────────────────────────────────────

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, stagger = 3, style }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-block", ...style }}>
      {text.split("").map((char, i) => {
        const cf = frame - startFrame - i * stagger;
        const opacity = interpolate(cf, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(cf, [0, 12], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
        return (
          <span key={i} style={{ display: "inline-block", opacity, transform: `translateY(${y}px)` }}>
            {char === " " ? " " : char}
          </span>
        );
      })}
    </span>
  );
};

const RotatingShape: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  startAngle?: number;
  speed?: number;
  opacity?: number;
}> = ({ x, y, size, color, startAngle = 0, speed = 1, opacity = 0.12 }) => {
  const frame = useCurrentFrame();
  const angle = startAngle + frame * speed * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderRadius: 8,
        opacity,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── SCENES ───────────────────────────────────────────────────────────────────

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ frame, fps, config: { damping: 12 } });
  const scale = interpolate(spr, [0, 1], [0.8, 1]);
  const rotX = interpolate(frame, [0, 90], [5, 0]);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CinematicBackground />
      <div style={{ transform: `perspective(1000px) scale(${scale}) rotateX(${rotX}deg)`, opacity: fadeIn(frame, 0, 20) }}>
        <IDEWindow style={{ width: 500, height: 300 }}>
          <TypingCode 
            startFrame={10} 
            code={[
              "// The future of web",
              "const agency = {",
              "  mission: 'Build Art',",
              "  status: 'Ready'",
              "};"
            ]} 
          />
        </IDEWindow>
      </div>
      <div style={{ position: "absolute", bottom: 120, textAlign: "center", opacity: fadeIn(frame, 40, 20) }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: "white", letterSpacing: -4 }}>STOP</div>
        <div style={{ fontSize: 20, color: "#6c63ff", letterSpacing: 8 }}>SCROLLING</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 200], [1, 1.05]);
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CinematicBackground />
      <div style={{ transform: `scale(${zoom})`, textAlign: "center" }}>
        <div style={{ fontSize: 16, color: "#6c63ff", letterSpacing: 6, marginBottom: 20, opacity: fadeIn(frame, 10, 20) }}>✦ WEB AGENCY ✦</div>
        <div style={{ fontSize: 100, fontWeight: 900, color: "white", lineHeight: 0.9 }}>
          <KineticText text="WE BUILD" startFrame={20} />
          <br />
          <KineticText 
            text="WEBSITES" 
            startFrame={40} 
            style={{ background: "linear-gradient(135deg, #6c63ff, #ff6b6b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} 
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = spring({ frame, fps: 60 });
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <CinematicBackground />
      <div style={{ textAlign: "center", transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])})`, opacity: spr }}>
        <div style={{ fontSize: 20, color: "#6c63ff", letterSpacing: 6, marginBottom: 20 }}>✦ LIMITED SPOTS ✦</div>
        <div style={{ fontSize: 90, fontWeight: 900, color: "white", marginBottom: 40 }}>GET STARTED</div>
        <div style={{ padding: "20px 50px", background: "linear-gradient(135deg, #6c63ff, #ff6b6b)", borderRadius: 50, color: "white", fontWeight: 700, fontSize: 22 }}>
          Book a Free Call →
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Transition: React.FC<{ color?: string }> = ({ color = "#6c63ff" }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 100], { easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ zIndex: 100, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: `${progress}%`, height: "100%", background: color, boxShadow: `0 0 40px ${color}` }} />
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = (frame / durationInFrames) * 100;
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.1)" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #6c63ff, #ff6b6b)" }} />
    </div>
  );
};

// ─── ROOT COMPOSITION ─────────────────────────────────────────────────────────

export const WebAgencyIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      <Sequence from={80} durationInFrames={30}>
        <Transition color="#6c63ff" />
      </Sequence>
      <Sequence from={90} durationInFrames={200}>
        <SceneIntro />
      </Sequence>
      <Sequence from={280} durationInFrames={30}>
        <Transition color="#ff6b6b" />
      </Sequence>
      <Sequence from={290} durationInFrames={610}>
        <SceneCTA />
      </Sequence>
      <ProgressBar />
    </AbsoluteFill>
  );
};
