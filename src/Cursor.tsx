import React from "react";
import { useCurrentFrame } from "remotion";

export interface Waypoint {
  x: number;
  y: number;
  frame: number;
}

export interface ClickEvent {
  frame: number;
  duration?: number;
}

interface CursorProps {
  waypoints: Waypoint[];
  clicks?: ClickEvent[];
  visible?: boolean;
  color?: string;
}

function smoothStep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function getCursorPos(frame: number, waypoints: Waypoint[]) {
  if (waypoints.length === 0) return { x: 0, y: 0 };
  if (waypoints.length === 1) return { x: waypoints[0].x, y: waypoints[0].y };

  if (frame <= waypoints[0].frame) return { x: waypoints[0].x, y: waypoints[0].y };

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = smoothStep((frame - a.frame) / (b.frame - a.frame));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }

  const last = waypoints[waypoints.length - 1];
  return { x: last.x, y: last.y };
}

export const Cursor: React.FC<CursorProps> = ({
  waypoints,
  clicks = [],
  visible = true,
  color = "#1A1A1A",
}) => {
  const frame = useCurrentFrame();
  if (!visible) return null;

  const { x, y } = getCursorPos(frame, waypoints);

  // Click scale animation
  let clickScale = 1;
  for (const ck of clicks) {
    const dur = ck.duration ?? 12;
    if (frame >= ck.frame && frame < ck.frame + dur) {
      const t = (frame - ck.frame) / dur;
      clickScale = 1 - Math.sin(t * Math.PI) * 0.35;
      break;
    }
  }

  // Ripple on click
  const activeClick = clicks.find((ck) => {
    const dur = ck.duration ?? 12;
    return frame >= ck.frame && frame < ck.frame + dur;
  });
  const rippleProgress = activeClick
    ? (frame - activeClick.frame) / (activeClick.duration ?? 12)
    : -1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 999,
        transform: `translate(-3px, -2px) scale(${clickScale})`,
        transformOrigin: "3px 2px",
      }}
    >
      {/* Ripple */}
      {rippleProgress >= 0 && (
        <div
          style={{
            position: "absolute",
            left: -12,
            top: -12,
            width: 24 + rippleProgress * 28,
            height: 24 + rippleProgress * 28,
            borderRadius: "50%",
            border: `1.5px solid ${color}`,
            opacity: 1 - rippleProgress,
            transform: "translate(-50%,-50%)",
            marginLeft: "50%",
            marginTop: "50%",
          }}
        />
      )}
      {/* Cursor SVG */}
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
        <path
          d="M2 2L2 19L6.5 14.5L10 21L12.5 20L9 13.5L15.5 13.5L2 2Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
