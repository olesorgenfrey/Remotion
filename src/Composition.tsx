import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { CinematicFrame } from "./components/CinematicFrame";
import { Background } from "./components/Background";
import { CodeEditor } from "./components/CodeEditor";
import { Overlay } from "./components/Overlay";
import { P } from "./components/palette";

// ─── TIMING CONSTANTS ────────────────────────────────────────────────────────

const T = {
  // Scene 1: cold open / title
  titleIn:       0,
  titleHold:     90,
  // Scene 2: editor enters
  editorEnter:   80,
  codeStart:     100,
  // Step-zoom keyframes
  zoom1Start:    300,
  zoom1End:      330,
  zoom2Start:    490,
  zoom2End:      520,
  zoomOutStart:  680,
  zoomOutEnd:    720,
  // Compilation
  compileStart:  580,
  // Outro
  outroStart:    760,
  // End
  end:           900,
} as const;

// ─── EXPO-OUT EASING ─────────────────────────────────────────────────────────

const expoOut = Easing.bezier(0.16, 1, 0.3, 1);

// ─── STEP ZOOM LOGIC ─────────────────────────────────────────────────────────

function getZoom(frame: number): number {
  if (frame < T.zoom1Start) return 1.0;
  if (frame < T.zoom1End) {
    return interpolate(
      frame,
      [T.zoom1Start, T.zoom1End],
      [1.0, 1.32],
      { easing: expoOut, extrapolateRight: "clamp" }
    );
  }
  if (frame < T.zoom2Start) return 1.32;
  if (frame < T.zoom2End) {
    return interpolate(
      frame,
      [T.zoom2Start, T.zoom2End],
      [1.32, 1.64],
      { easing: expoOut, extrapolateRight: "clamp" }
    );
  }
  if (frame < T.zoomOutStart) return 1.64;
  if (frame < T.zoomOutEnd) {
    return interpolate(
      frame,
      [T.zoomOutStart, T.zoomOutEnd],
      [1.64, 1.0],
      { easing: expoOut, extrapolateRight: "clamp" }
    );
  }
  return 1.0;
}

// ─── KINETIC TITLE ────────────────────────────────────────────────────────────

const KineticTitle: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const line1 = "MOTION";
  const line2 = "DESIGN";

  const renderLine = (text: string, lineDelay: number) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {text.split("").map((ch, i) => {
        const p = spring({
          frame: frame - startFrame - lineDelay - i * 4,
          fps: 60,
          config: { damping: 14, stiffness: 160, mass: 0.7 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              color: P.offWhite,
              fontSize: Math.min(width * 0.085, 148),
              fontWeight: 900,
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              textTransform: "uppercase" as const,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );

  const subtitleP = spring({
    frame: frame - startFrame - 60,
    fps: 60,
    config: { damping: 20, stiffness: 120 },
  });

  const showEditor = frame >= T.editorEnter + 40;

  // Fade title out when editor is well established
  const titleFadeOut = interpolate(
    frame,
    [T.editorEnter + 60, T.editorEnter + 120],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: expoOut }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        opacity: titleFadeOut,
        pointerEvents: "none",
      }}
    >
      {renderLine(line1, 0)}
      {renderLine(line2, 15)}

      <div
        style={{
          marginTop: 24,
          opacity: subtitleP * titleFadeOut,
          transform: `translateY(${interpolate(subtitleP, [0, 1], [20, 0])}px)`,
          color: P.accent,
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          letterSpacing: "0.35em",
          textTransform: "uppercase" as const,
        }}
      >
        by Simplicissimus
      </div>

      {/* Accent line */}
      <div
        style={{
          marginTop: 20,
          width: interpolate(subtitleP, [0, 1], [0, 180]),
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)`,
          opacity: subtitleP * 0.6 * titleFadeOut,
        }}
      />
    </div>
  );
};

// ─── OUTRO ────────────────────────────────────────────────────────────────────

const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const p = spring({
    frame: frame - T.outroStart,
    fps: 60,
    config: { damping: 20, stiffness: 100 },
  });
  const opacity = interpolate(p, [0, 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [T.end - 40, T.end],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 72,
        opacity: opacity * fadeOut,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: interpolate(p, [0, 1], [0, 320]),
          height: 1,
          background: `linear-gradient(90deg, transparent, ${P.accentOrange}, transparent)`,
          marginBottom: 20,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          color: P.offWhiteDim,
          fontSize: 11,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
        }}
      >
        Build beautiful animations.
      </div>
    </div>
  );
};

// ─── VIGNETTE FLASH (SCENE TRANSITION) ──────────────────────────────────────

const TransitionFlash: React.FC<{ atFrame: number; color?: string }> = ({
  atFrame,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [atFrame, atFrame + 3, atFrame + 18],
    [0, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── ROOT COMPOSITION ────────────────────────────────────────────────────────

export const WebAgencyIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const zoom = getZoom(frame);

  // Zoom origin: center of screen
  const zoomOriginX = 50;
  const zoomOriginY = 52;

  // Shake intensity increases slightly during zoom transitions
  const isZooming =
    (frame >= T.zoom1Start && frame < T.zoom1End + 20) ||
    (frame >= T.zoom2Start && frame < T.zoom2End + 20);
  const shakeIntensity = isZooming ? 3.5 : 1.2;

  // Motion blur during fast zoom
  const motionBlur = isZooming
    ? interpolate(
        frame,
        [T.zoom1Start, T.zoom1Start + 8, T.zoom1End],
        [0, 0.8, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  return (
    <AbsoluteFill style={{ background: P.bgDeep }}>
      <CinematicFrame
        zoom={zoom}
        zoomOriginX={zoomOriginX}
        zoomOriginY={zoomOriginY}
        shakeIntensity={shakeIntensity}
        motionBlur={motionBlur}
      >
        {/* Layer 1: textured background */}
        <Background />

        {/* Layer 2: code editor (enters at editorEnter) */}
        <CodeEditor
          enterFrame={T.editorEnter}
          compileFrame={T.compileStart}
        />

        {/* Layer 3: kinetic title (fades out as editor enters) */}
        <KineticTitle startFrame={T.titleIn} />

        {/* Layer 4: overlay chrome */}
        <Overlay startFrame={T.titleHold} />

        {/* Layer 5: outro tag */}
        <Outro />
      </CinematicFrame>

      {/* Transition flashes sit outside CinematicFrame (no shake/zoom) */}
      <TransitionFlash atFrame={T.zoom1Start} color={P.accent} />
      <TransitionFlash atFrame={T.zoom2Start} color={P.accent} />
      <TransitionFlash atFrame={T.zoomOutStart} color="#ffffff" />

      {/* Hard fade-in from black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: interpolate(frame, [0, 20], [1, 0], {
            extrapolateRight: "clamp",
          }),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
