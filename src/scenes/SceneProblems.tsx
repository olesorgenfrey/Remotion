import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../Cursor";
import { C, F } from "../styles/colors";

const problems = [
  { text: "Öffnungszeiten", highlight: "falsch.", delay: 0 },
  { text: "Kontaktformular", highlight: "kaputt.", delay: 18 },
  { text: "Niemand hat", highlight: "Zeit.", delay: 36 },
];

const ProblemLine: React.FC<{
  text: string;
  highlight: string;
  delay: number;
  shake?: boolean;
}> = ({ text, highlight, delay, shake }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 180 } });
  const shakeX = shake
    ? interpolate(frame, [delay + 2, delay + 4, delay + 6, delay + 8], [-4, 4, -2, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-30, 0]) + shakeX}px)`,
        marginBottom: 28,
      }}
    >
      <span
        style={{
          fontFamily: F.serif,
          fontSize: 72,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.1,
        }}
      >
        {text}
      </span>
      <span
        style={{
          fontFamily: F.serif,
          fontSize: 72,
          fontWeight: 700,
          color: C.accent,
          lineHeight: 1.1,
        }}
      >
        {highlight}
      </span>
    </div>
  );
};

const MockErrorScreen: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();
  const shakeX =
    frame >= 5 && frame < 14
      ? interpolate(frame, [5, 7, 9, 11, 13], [0, -6, 5, -4, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        width: 860,
        height: 500,
        borderRadius: 16,
        background: "#F8F4F0",
        border: `1px solid ${C.lines}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: `translateX(${shakeX}px)`,
      }}
    >
      {/* Browser bar */}
      <div
        style={{
          height: 44,
          background: "#EDEBE8",
          borderBottom: `1px solid ${C.lines}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => (
          <div
            key={col}
            style={{ width: 12, height: 12, borderRadius: "50%", background: col }}
          />
        ))}
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            height: 26,
            borderRadius: 6,
            background: C.bg,
            border: `1px solid ${C.lines}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            fontFamily: F.sans,
            fontSize: 13,
            color: C.dim,
          }}
        >
          www.mein-betrieb.de
        </div>
      </div>

      {/* Error page */}
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100% - 44px)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 22,
            fontWeight: 700,
            color: C.text,
          }}
        >
          Diese Seite ist nicht mehr aktuell
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 16,
            color: C.dim,
            textAlign: "center",
            maxWidth: 360,
          }}
        >
          Kontaktformular funktioniert nicht · Öffnungszeiten veraltet
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "10px 24px",
            background: "#E5E0D8",
            borderRadius: 8,
            fontFamily: F.sans,
            fontSize: 14,
            color: C.dim,
          }}
        >
          Zuletzt aktualisiert: 2019
        </div>
      </div>
    </div>
  );
};

export const SceneProblems: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [80, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Show mock screen first half, text second half
  const showScreen = frame < 45;
  const screenOpacity = interpolate(frame, [0, 8, 38, 45], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [40, 50], [0, 1], { extrapolateRight: "clamp" });

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
      }}
    >
      {/* Mock error screen */}
      <div
        style={{
          position: "absolute",
          opacity: screenOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MockErrorScreen visible={showScreen} />
      </div>

      {/* Problem text lines */}
      <div
        style={{
          opacity: textOpacity,
          padding: "0 80px",
          width: "100%",
        }}
      >
        {problems.map((p) => (
          <ProblemLine key={p.text} {...p} delay={p.delay} shake={p.delay === 0} />
        ))}
      </div>

      {/*
        Browser window: 860×500, centered → left=110, top=710
        Error emoji: x=540 y=800 | "Zuletzt"-button: x=540 y=1000
        Problem lines (padding 0 80px, centered):
          line1 y≈860  line2 y≈970  line3 y≈1080
      */}
      <Cursor
        waypoints={[
          { x: 540, y: 820,  frame: 0  },  // hover over error icon
          { x: 540, y: 1000, frame: 10 },  // move to "Zuletzt" button
          { x: 480, y: 920,  frame: 22 },  // back to error text
          { x: 540, y: 1000, frame: 32 },  // click button again
          // screen switches to problem text at ~frame 45
          { x: 200, y: 860,  frame: 50 },  // → line 1: "Öffnungszeiten"
          { x: 200, y: 970,  frame: 65 },  // → line 2: "Kontaktformular"
          { x: 200, y: 1080, frame: 80 },  // → line 3: "Niemand"
        ]}
        clicks={[
          { frame: 10 },   // click "Zuletzt aktualisiert"
          { frame: 32 },   // click button again
          { frame: 50 },   // tap line 1
          { frame: 65 },   // tap line 2
          { frame: 80 },   // tap line 3
        ]}
        color={C.text}
      />
    </div>
  );
};
