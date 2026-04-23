import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { SceneHook }       from "./scenes/SceneHook";
import { SceneProblems }   from "./scenes/SceneProblems";
import { SceneWebsite }    from "./scenes/SceneWebsite";
import { SceneSolution }   from "./scenes/SceneSolution";
import { SceneNavigation } from "./scenes/SceneNavigation";
import { SceneContact }    from "./scenes/SceneContact";
import { SceneFinal }      from "./scenes/SceneFinal";
import { C, SCENES }       from "./styles/colors";

// ── Transition flash between scenes ──────────────────────────────────────────
const SceneFlash: React.FC<{ atFrame: number }> = ({ atFrame }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [atFrame, atFrame + 2, atFrame + 10],
    [0, 0.18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.bg,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / totalFrames;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `${C.lines}80`,
        zIndex: 200,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: C.accent,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const StorefrontVideo: React.FC = () => {
  const TOTAL = 720;
  const transitions = [60, 150, 210, 330, 480, 600];

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>

      <Sequence from={SCENES.hook.from}       durationInFrames={SCENES.hook.dur}>
        <SceneHook />
      </Sequence>

      <Sequence from={SCENES.problems.from}   durationInFrames={SCENES.problems.dur}>
        <SceneProblems />
      </Sequence>

      <Sequence from={SCENES.website.from}    durationInFrames={SCENES.website.dur}>
        <SceneWebsite />
      </Sequence>

      <Sequence from={SCENES.solution.from}   durationInFrames={SCENES.solution.dur}>
        <SceneSolution />
      </Sequence>

      <Sequence from={SCENES.navigation.from} durationInFrames={SCENES.navigation.dur}>
        <SceneNavigation />
      </Sequence>

      <Sequence from={SCENES.contact.from}    durationInFrames={SCENES.contact.dur}>
        <SceneContact />
      </Sequence>

      <Sequence from={SCENES.final.from}      durationInFrames={SCENES.final.dur}>
        <SceneFinal />
      </Sequence>

      {/* Scene transition flashes */}
      {transitions.map((t) => (
        <SceneFlash key={t} atFrame={t} />
      ))}

      {/* Progress bar */}
      <ProgressBar totalFrames={TOTAL} />

      {/* Hard fade from black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: interpolate(useCurrentFrame(), [0, 8], [1, 0], { extrapolateRight: "clamp" }),
          pointerEvents: "none",
          zIndex: 300,
        }}
      />
    </AbsoluteFill>
  );
};
