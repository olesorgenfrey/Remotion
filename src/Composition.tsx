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

// ─── KINETIC TEXT ─────────────────────────────────────────────────────────────

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
        const opacity = interpolate(cf, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(cf, [0, 12], [40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.5)),
        });
        const scale = interpolate(cf, [0, 10], [0.5, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
            }}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </span>
  );
};

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────────

const FloatingParticle: React.FC<{
  x: number;
  startY: number;
  size: number;
  color: string;
  delay: number;
}> = ({ x, startY, size, color, delay }) => {
  const frame = useCurrentFrame();
  const loopFrame = (frame + delay * 30) % 200;
  const y = interpolate(loopFrame, [0, 200], [startY, startY - 35]);
  const opacity = interpolate(loopFrame, [0, 30, 160, 200], [0, 0.75, 0.5, 0]);
  const wobble = Math.sin((frame + delay * 10) * 0.04) * 12;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x + wobble * 0.08}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
    />
  );
};

// ─── ROTATING SHAPE ───────────────────────────────────────────────────────────

const RotatingShape: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  startAngle?: number;
  speed?: number;
  shape?: "square" | "circle";
  opacity?: number;
}> = ({
  x,
  y,
  size,
  color,
  startAngle = 0,
  speed = 1,
  shape = "square",
  opacity = 0.12,
}) => {
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
        borderRadius: shape === "circle" ? "50%" : 8,
        opacity,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────

const Counter: React.FC<{
  to: number;
  startFrame: number;
  duration: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, startFrame, duration, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, startFrame + duration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={style}>
      {Math.round(value)}
      {suffix}
    </span>
  );
};

// ─── GLOW LINE ────────────────────────────────────────────────────────────────

const GlowLine: React.FC<{ startFrame: number; duration: number; color?: string }> = ({
  startFrame,
  duration,
  color = "#6c63ff",
}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [startFrame, startFrame + duration], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        width: `${w}%`,
        height: 3,
        background: `linear-gradient(90deg, ${color}, #ff6b6b)`,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        borderRadius: 2,
      }}
    />
  );
};

// ─── ANIMATED BROWSER ─────────────────────────────────────────────────────────

const AnimatedBrowser: React.FC = () => {
  const frame = useCurrentFrame();
  const load = interpolate(frame, [0, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        background: "#1a1a2e",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(108,99,255,0.4)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(108,99,255,0.15)",
        position: "relative",
      }}
    >
      {/* Loading bar */}
      {load < 98 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 3,
            width: `${load}%`,
            background: "linear-gradient(90deg, #6c63ff, #4ecdc4)",
            boxShadow: "0 0 8px #6c63ff",
          }}
        />
      )}
      {/* Chrome */}
      <div
        style={{
          padding: "12px 16px",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
          <div
            key={i}
            style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: 26,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 6,
            marginLeft: 8,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              fontFamily: "monospace",
            }}
          >
            yoursite.com
          </span>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: 24, minHeight: 280 }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,107,0.1))",
            borderRadius: 12,
            height: 130,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              height: 18,
              width: `${Math.min(75, load * 1.1)}%`,
              background: "rgba(255,255,255,0.3)",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: 11,
              width: `${Math.min(50, load * 0.75)}%`,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: 34,
              width: 110,
              background: "linear-gradient(135deg, #6c63ff, #ff6b6b)",
              borderRadius: 17,
              marginTop: 8,
              opacity: interpolate(load, [60, 80], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[0.3, 0.55, 0.75].map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 72,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
                border: "1px solid rgba(108,99,255,0.2)",
                opacity: interpolate(load, [d * 100, d * 100 + 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(
                  load,
                  [d * 100, d * 100 + 20],
                  [20, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SCENE TRANSITION ─────────────────────────────────────────────────────────

const Transition: React.FC<{ color?: string }> = ({ color = "#6c63ff" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, 20, 32], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ background: color, opacity, pointerEvents: "none" }}
    />
  );
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = (frame / durationInFrames) * 100;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "rgba(255,255,255,0.08)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #6c63ff, #ff6b6b, #4ecdc4)",
          boxShadow: "0 0 8px rgba(108,99,255,0.9)",
        }}
      />
    </div>
  );
};

// ─── SCENE 1 · HOOK ───────────────────────────────────────────────────────────

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // White flash on first frame
  const flash = interpolate(frame, [0, 4, 10, 20], [0, 1, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 280, mass: 0.3 },
  });
  const textScale = interpolate(scaleSpring, [0, 1], [2.2, 1]);
  const textOpacity = interpolate(frame, [0, 8, 65, 88], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "white", opacity: flash }} />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,99,255,0.35) 0%, transparent 65%)",
          transform: `scale(${scaleSpring})`,
        }}
      />

      <div
        style={{
          textAlign: "center",
          transform: `scale(${textScale})`,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -5,
            lineHeight: 1,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            textShadow: "0 0 60px rgba(108,99,255,0.9)",
          }}
        >
          STOP
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: "#6c63ff",
            letterSpacing: 10,
            marginTop: 10,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            opacity: subOpacity,
          }}
        >
          SCROLLING
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 · INTRO ──────────────────────────────────────────────────────────

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = 1 + Math.sin(frame * 0.04) * 0.06;

  const browserSpring = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.5 },
  });

  const particles = [
    { x: 8, startY: 82, size: 5, color: "#6c63ff", delay: 0 },
    { x: 22, startY: 68, size: 3, color: "#ff6b6b", delay: 0.5 },
    { x: 68, startY: 87, size: 4, color: "#4ecdc4", delay: 1.1 },
    { x: 84, startY: 60, size: 6, color: "#ffe66d", delay: 0.3 },
    { x: 54, startY: 74, size: 3, color: "#6c63ff", delay: 1.6 },
    { x: 38, startY: 91, size: 5, color: "#ff6b6b", delay: 0.9 },
    { x: 92, startY: 48, size: 4, color: "#4ecdc4", delay: 0.2 },
    { x: 76, startY: 30, size: 3, color: "#ffe66d", delay: 1.3 },
  ];

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 25% 50%, #1a0533 0%, #0d0d1a 55%, #000814 100%)",
      }}
    >
      <RotatingShape x={85} y={18} size={240} color="#6c63ff" speed={0.25} opacity={0.1} />
      <RotatingShape x={78} y={32} size={140} color="#ff6b6b" startAngle={45} speed={-0.35} opacity={0.08} />
      <RotatingShape x={12} y={72} size={180} color="#4ecdc4" startAngle={90} speed={0.18} shape="circle" opacity={0.07} />

      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      {/* Ambient orb */}
      <div
        style={{
          position: "absolute",
          width: 580,
          height: 580,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)",
          left: "2%",
          top: "5%",
          transform: `scale(${bgPulse})`,
          pointerEvents: "none",
        }}
      />

      {/* Left: copy */}
      <div
        style={{
          position: "absolute",
          left: "7%",
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 660,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#6c63ff",
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 22,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            opacity: fadeIn(frame, 5, 18),
            transform: `translateY(${slideUp(frame, 5, 18)}px)`,
          }}
        >
          ✦ WEB AGENCY ✦
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -4,
            lineHeight: 0.95,
            marginBottom: 26,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <KineticText text="WE BUILD" startFrame={8} stagger={4} />
          </div>
          <div style={{ overflow: "hidden" }}>
            <KineticText
              text="WEBSITES"
              startFrame={18}
              stagger={4}
              style={{
                background: "linear-gradient(135deg, #6c63ff 0%, #ff6b6b 55%, #4ecdc4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "rgba(255,255,255,0.65)",
            letterSpacing: 3,
            marginBottom: 30,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            opacity: fadeIn(frame, 52, 22),
            transform: `translateY(${slideUp(frame, 52, 22)}px)`,
          }}
        >
          Fast · Clean · Modern · Results
        </div>

        <div style={{ opacity: fadeIn(frame, 58, 10) }}>
          <GlowLine startFrame={58} duration={28} />
        </div>
      </div>

      {/* Right: browser */}
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          width: 500,
          transform: `translateY(-50%) scale(${interpolate(browserSpring, [0, 1], [0.82, 1])})`,
          opacity: interpolate(browserSpring, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <AnimatedBrowser />
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 · STATS ──────────────────────────────────────────────────────────

const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { to: 500, suffix: "+", label: "Sites Built", icon: "🌐", color: "#6c63ff", start: 15 },
    { to: 98, suffix: "%", label: "Happy Clients", icon: "⭐", color: "#ffe66d", start: 30 },
    { to: 3, suffix: "x", label: "Faster Load", icon: "⚡", color: "#4ecdc4", start: 45 },
    { to: 24, suffix: "hr", label: "Support", icon: "🛡️", color: "#ff6b6b", start: 60 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #000814 0%, #001233 55%, #0d0d1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RotatingShape x={96} y={4} size={320} color="#6c63ff" speed={0.2} opacity={0.06} />
      <RotatingShape x={4} y={92} size={220} color="#4ecdc4" speed={-0.12} startAngle={30} opacity={0.05} />

      <div
        style={{
          textAlign: "center",
          marginBottom: 64,
          opacity: fadeIn(frame, 0, 18),
          transform: `translateY(${slideUp(frame, 0, 18)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 15,
            letterSpacing: 7,
            color: "#6c63ff",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 14,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          WHY CHOOSE US
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -3,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          The Numbers Speak
        </div>
      </div>

      <div style={{ display: "flex", gap: 52 }}>
        {stats.map((s, i) => {
          const sp = spring({
            frame: Math.max(0, frame - s.start),
            fps,
            config: { damping: 11, stiffness: 190, mass: 0.4 },
          });
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                width: 190,
                transform: `translateY(${interpolate(sp, [0, 1], [90, 0])}px) scale(${interpolate(sp, [0, 1], [0.65, 1])})`,
                opacity: sp,
              }}
            >
              <div style={{ fontSize: 50, marginBottom: 10 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                  textShadow: `0 0 30px ${s.color}88`,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                <Counter to={s.to} startFrame={s.start + 5} duration={55} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 10,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  marginTop: 14,
                  height: 3,
                  width: 40,
                  background: s.color,
                  borderRadius: 2,
                  boxShadow: `0 0 10px ${s.color}`,
                  margin: "14px auto 0",
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 · SERVICES ───────────────────────────────────────────────────────

interface ServiceCardProps {
  icon: string;
  title: string;
  subtitle: string;
  startFrame: number;
  direction: "left" | "right" | "up";
  color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  subtitle,
  startFrame,
  direction,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 13, stiffness: 210, mass: 0.45 },
  });

  const x =
    direction === "left"
      ? interpolate(sp, [0, 1], [-120, 0])
      : direction === "right"
      ? interpolate(sp, [0, 1], [120, 0])
      : 0;
  const y = direction === "up" ? interpolate(sp, [0, 1], [80, 0]) : 0;
  const opacity = interpolate(sp, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
        opacity,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}44`,
        borderRadius: 18,
        padding: "30px 34px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)`,
        minWidth: 280,
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 14 }}>{icon}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 8,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.55)",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          marginTop: 18,
          height: 3,
          width: 44,
          background: color,
          borderRadius: 2,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  );
};

const SceneServices: React.FC = () => {
  const frame = useCurrentFrame();

  const services: ServiceCardProps[] = [
    {
      icon: "🎨",
      title: "Web Design",
      subtitle: "Stunning visuals that convert",
      startFrame: 12,
      direction: "left",
      color: "#6c63ff",
    },
    {
      icon: "⚡",
      title: "Development",
      subtitle: "Lightning-fast performance",
      startFrame: 28,
      direction: "up",
      color: "#4ecdc4",
    },
    {
      icon: "📈",
      title: "SEO & Growth",
      subtitle: "Rank #1 on Google",
      startFrame: 44,
      direction: "right",
      color: "#ff6b6b",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #1a0533 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RotatingShape x={50} y={8} size={450} color="#6c63ff" speed={0.08} opacity={0.04} />

      <div
        style={{
          textAlign: "center",
          marginBottom: 58,
          opacity: fadeIn(frame, 0, 18),
          transform: `translateY(${slideUp(frame, 0, 18)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 15,
            letterSpacing: 7,
            color: "#4ecdc4",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 14,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          OUR SERVICES
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -3,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Everything You Need
        </div>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {services.map((s, i) => (
          <ServiceCard key={i} {...s} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 · CTA ────────────────────────────────────────────────────────────

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 1 + Math.sin(frame * 0.1) * 0.028;

  const mainSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, stiffness: 210, mass: 0.4 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0d0d1a 0%, #000814 50%, #1a0533 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <RotatingShape x={50} y={50} size={650} color="#6c63ff" speed={0.08} opacity={0.04} />
      <RotatingShape x={50} y={50} size={440} color="#ff6b6b" startAngle={60} speed={-0.12} opacity={0.04} />

      {/* Glowing orb */}
      <div
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,99,255,0.28) 0%, transparent 70%)",
          transform: `scale(${pulse})`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          textAlign: "center",
          transform: `scale(${interpolate(mainSpring, [0, 1], [0.82, 1])})`,
          opacity: mainSpring,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 7,
            color: "#6c63ff",
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: 22,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          ✦ Limited Spots Available ✦
        </div>

        <div
          style={{
            fontSize: 104,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -5,
            lineHeight: 0.9,
            marginBottom: 28,
            textShadow: "0 0 70px rgba(108,99,255,0.5)",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <KineticText text="GET STARTED" startFrame={10} stagger={5} />
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #6c63ff 0%, #ff6b6b 55%, #4ecdc4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <KineticText text="TODAY" startFrame={28} stagger={9} />
          </span>
        </div>

        {/* CTA button */}
        <div
          style={{
            display: "inline-block",
            marginTop: 34,
            padding: "22px 64px",
            background: "linear-gradient(135deg, #6c63ff, #ff6b6b)",
            borderRadius: 60,
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            boxShadow:
              "0 0 30px rgba(108,99,255,0.55), 0 0 60px rgba(255,107,107,0.28)",
            transform: `scale(${pulse})`,
            opacity: fadeIn(frame, 52, 18),
          }}
        >
          Book a Free Call →
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 18,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            opacity: fadeIn(frame, 68, 18),
          }}
        >
          yoursite.com · hello@yoursite.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ROOT COMPOSITION ─────────────────────────────────────────────────────────
//
// Timeline at 60 fps:
//   0  –  90  (1.5 s)  Hook
//  90  – 290  (3.3 s)  Intro
// 290  – 470  (3.0 s)  Stats
// 470  – 650  (3.0 s)  Services
// 650  – 900  (4.2 s)  CTA
// Total: 900 frames = 15 s

export const WebAgencyIntro: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", overflow: "hidden" }}
    >
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>

      <Sequence from={80} durationInFrames={32}>
        <Transition color="#6c63ff" />
      </Sequence>

      <Sequence from={90} durationInFrames={200}>
        <SceneIntro />
      </Sequence>

      <Sequence from={278} durationInFrames={32}>
        <Transition color="#001233" />
      </Sequence>

      <Sequence from={290} durationInFrames={180}>
        <SceneStats />
      </Sequence>

      <Sequence from={458} durationInFrames={32}>
        <Transition color="#1a0533" />
      </Sequence>

      <Sequence from={470} durationInFrames={180}>
        <SceneServices />
      </Sequence>

      <Sequence from={638} durationInFrames={32}>
        <Transition color="#6c63ff" />
      </Sequence>

      <Sequence from={650} durationInFrames={250}>
        <SceneCTA />
      </Sequence>

      <ProgressBar />
    </AbsoluteFill>
  );
};
