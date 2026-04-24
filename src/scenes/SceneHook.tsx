import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../Cursor";
import { C, F } from "../styles/colors";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const line1Scale = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const line2Scale = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 140 } });

  const zoomScale = interpolate(frame, [0, 60], [1, 1.04], { extrapolateRight: "clamp" });

  // Fade out last 8 frames
  const fadeOut = interpolate(frame, [52, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cursor blink near "zweiter Job"
  const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

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
        transform: `scale(${zoomScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Thin top line accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: C.accent,
          transform: `scaleX(${interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" })})`,
          transformOrigin: "left",
        }}
      />

      <div
        style={{
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 88,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.05,
            opacity: line1Scale,
            transform: `translateY(${interpolate(line1Scale, [0, 1], [40, 0])}px)`,
          }}
        >
          Deine Website
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 88,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.05,
            marginTop: 8,
            opacity: line2Scale,
            transform: `translateY(${interpolate(line2Scale, [0, 1], [40, 0])}px)`,
          }}
        >
          sollte nicht dein
        </div>

        {/* Line 3 — accent highlight */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            marginTop: 8,
            opacity: spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 140 } }),
            transform: `translateY(${interpolate(
              spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 140 } }),
              [0, 1], [40, 0]
            )}px)`,
          }}
        >
          <span
            style={{
              fontFamily: F.serif,
              fontSize: 88,
              fontWeight: 700,
              color: C.accent,
              lineHeight: 1.05,
              position: "relative",
            }}
          >
            zweiter Job
            {/* Underline */}
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                height: 3,
                background: C.accent,
                opacity: 0.4,
                transform: `scaleX(${interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                transformOrigin: "left",
              }}
            />
          </span>
          <span
            style={{
              fontFamily: F.serif,
              fontSize: 88,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.05,
            }}
          >
            sein.
          </span>
        </div>

        {/* Blinking cursor element */}
        <div
          style={{
            display: "inline-block",
            width: 3,
            height: 80,
            background: C.accent,
            marginLeft: 8,
            marginTop: 8,
            opacity: cursorOpacity * interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
            verticalAlign: "middle",
          }}
        />
      </div>

      {/* Cursor hovers near end of "zweiter Job" — x≈660 = center+120, y≈1060 = line 3 center */}
      <Cursor
        waypoints={[
          { x: 300, y: 1060, frame: 0  },  // starts left of "zweiter"
          { x: 660, y: 1060, frame: 20 },  // moves to end of "zweiter Job"
          { x: 670, y: 1060, frame: 40 },  // tiny drift — stays on word
          { x: 665, y: 1062, frame: 60 },
        ]}
        color={C.text}
      />
    </div>
  );
};
