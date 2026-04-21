import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fadeIn = (frame: number, start: number, duration: number = 15) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─── BACKGROUND ELEMENTS ──────────────────────────────────────────────────────
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "#020617", // Slate-950
        overflow: "hidden",
      }}
    >
      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />
      {/* Animated Bokeh / Glow */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.02) * 20}% ${50 + Math.cos(frame * 0.02) * 20}%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at ${30 + Math.cos(frame * 0.03) * 15}% ${70 + Math.sin(frame * 0.03) * 15}%, rgba(6, 182, 212, 0.1) 0%, transparent 40%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── IDE WINDOW COMPONENT ─────────────────────────────────────────────────────
const IDEWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}> = ({ children, title = "index.ts", style }) => {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.8)", // Slate-900 with opacity
        backdropFilter: "blur(12px)",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* macOS Title Bar */}
      <div
        style={{
          height: 40,
          background: "rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28ca41" }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "monospace",
            marginRight: 40,
          }}
        >
          {title}
        </div>
      </div>
      {/* Content Area */}
      <div style={{ flex: 1, padding: 20, position: "relative" }}>
        {children}
      </div>
    </div>
  );
};

// ─── TYPING EFFECT COMPONENT ──────────────────────────────────────────────────
const TypingCode: React.FC<{
  code: string[];
  startFrame: number;
  fps: number;
}> = ({ code, startFrame, fps }) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);
  
  // Total characters to show
  const totalChars = code.join("\n").length;
  const charsToShow = Math.floor(interpolate(relativeFrame, [0, 60], [0, totalChars], {
    extrapolateRight: "clamp",
    easing: Easing.linear,
  }));

  let currentCharCount = 0;
  
  return (
    <div style={{ fontFamily: "monospace", fontSize: 18, lineHeight: 1.6, color: "#e2e8f0" }}>
      {code.map((line, i) => {
        const lineStart = currentCharCount;
        currentCharCount += line.length + 1; // +1 for newline
        
        if (charsToShow <= lineStart) return null;
        
        const visibleInLine = Math.min(line.length, charsToShow - lineStart);
        const text = line.substring(0, visibleInLine);
        
        // Simple Syntax Highlighting Logic
        const parts = text.split(/(\s+|[{}()[\],.;])|(\b(?:const|export|import|from|return|if|else|for|while|async|await)\b)/g).filter(Boolean);

        return (
          <div key={i} style={{ whiteSpace: "pre" }}>
            <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 20, userSelect: "none" }}>{i + 1}</span>
            {parts.map((part, j) => {
              let color = "#e2e8f0"; // Default
              if (/^(const|export|import|from|return|if|else|for|while|async|await)$/.test(part)) color = "#c084fc"; // Purple
              else if (/^[{}()[\],.;]$/.test(part)) color = "#94a3b8"; // Slate
              else if (/^[A-Z]/.test(part)) color = "#38bdf8"; // Cyan
              
              return <span key={j} style={{ color }}>{part}</span>;
            })}
            {visibleInLine < line.length && i === code.findIndex((_, idx) => charsToShow < (code.slice(0, idx+1).join("\n").length)) && (
              <span style={{ width: 8, height: 20, background: "#38bdf8", display: "inline-block", verticalAlign: "middle", marginLeft: 2 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── SCENE 1: HOOK (CINEMATIC) ────────────────────────────────────────────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const moveSpring = spring({ frame, fps, config: { damping: 12 } });
  const scale = interpolate(moveSpring, [0, 1], [0.8, 1]);
  const rotateX = interpolate(frame, [0, 90], [10, 0]);
  const rotateY = interpolate(frame, [0, 90], [-10, 0]);

  const codeSnippet = [
    "import { Animation } from 'remotion';",
    "",
    "export const Cinematic = () => {",
    "  return <Experience />;",
    "};"
  ];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Background />
      <div
        style={{
          transform: `perspective(1000px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          opacity: fadeIn(frame, 0, 20),
        }}
      >
        <IDEWindow style={{ width: 600, height: 350 }}>
          <TypingCode code={codeSnippet} startFrame={10} fps={fps} />
        </IDEWindow>
      </div>
      
      <div
        style={{
          position: "absolute",
          bottom: 100,
          fontSize: 48,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          textShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
          opacity: fadeIn(frame, 40, 20),
          transform: `translateY(${interpolate(frame, [40, 60], [20, 0], { extrapolateLeft: "clamp" })}px)`,
        }}
      >
        Code becomes <span style={{ color: "#38bdf8" }}>Art</span>.
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: INTRO ───────────────────────────────────────────────────────────
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const zoom = interpolate(frame, [0, 200], [1, 1.1]);
  
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Background />
      <div style={{ transform: `scale(${zoom})`, textAlign: "center" }}>
        <h1 style={{ 
          fontSize: 120, 
          fontWeight: 900, 
          color: "white", 
          margin: 0,
          letterSpacing: -4,
          background: "linear-gradient(to bottom, #fff, #94a3b8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: fadeIn(frame, 0, 30)
        }}>
          REMOTION
        </h1>
        <p style={{ 
          fontSize: 24, 
          color: "#38bdf8", 
          letterSpacing: 8, 
          textTransform: "uppercase",
          opacity: fadeIn(frame, 20, 30),
          marginTop: -10
        }}>
          Cinematic Experience
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── TRANSITION ───────────────────────────────────────────────────────────────
const Transition: React.FC<{ color?: string }> = ({ color = "#38bdf8" }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 100], {
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ zIndex: 100, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${progress}%`,
          height: "100%",
          background: color,
          boxShadow: `0 0 50px ${color}`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── ROOT COMPOSITION ─────────────────────────────────────────────────────────
export const WebAgencyIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={120}>
        <SceneHook />
      </Sequence>
      
      <Sequence from={110} durationInFrames={30}>
        <Transition color="#38bdf8" />
      </Sequence>

      <Sequence from={120} durationInFrames={180}>
        <SceneIntro />
      </Sequence>
    </AbsoluteFill>
  );
};
