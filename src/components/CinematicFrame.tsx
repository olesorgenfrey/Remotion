import React from "react";
import { useCurrentFrame } from "remotion";

function hash(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

function smoothNoise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3.0 - 2.0 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

function fbm(x: number): number {
  let value = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let total = 0;
  for (let i = 0; i < 4; i++) {
    value += smoothNoise(x * frequency) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2.1;
  }
  return (value / total) * 2 - 1;
}

interface CinematicFrameProps {
  children: React.ReactNode;
  shakeIntensity?: number;
  zoom?: number;
  zoomOriginX?: number;
  zoomOriginY?: number;
  motionBlur?: number;
}

export const CinematicFrame: React.FC<CinematicFrameProps> = ({
  children,
  shakeIntensity = 1.5,
  zoom = 1,
  zoomOriginX = 50,
  zoomOriginY = 50,
  motionBlur = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame * 0.018;

  const shakeX = fbm(t + 0.3) * shakeIntensity;
  const shakeY = fbm(t + 17.5) * shakeIntensity;
  const shakeRot = fbm(t + 35.1) * 0.04 * shakeIntensity;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`,
          transform: `scale(${zoom}) translate(${shakeX}px, ${shakeY}px) rotate(${shakeRot}deg)`,
          filter: motionBlur > 0 ? `blur(${motionBlur}px)` : undefined,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};
