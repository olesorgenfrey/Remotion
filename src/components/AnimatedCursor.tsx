import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CursorWaypoint = {
  /** Absolute frame at which the cursor must be at (x, y). */
  frame: number;
  /** Horizontal position in canvas pixels (0 = left edge). */
  x: number;
  /** Vertical position in canvas pixels (0 = top edge). */
  y: number;
  /**
   * When true the cursor plays a press-and-release scale animation and emits
   * an expanding ripple ring at this waypoint.
   */
  click?: boolean;
};

type AnimatedCursorProps = {
  /** Ordered or unordered list of positions the cursor should visit. */
  waypoints: CursorWaypoint[];
  /**
   * Size of the cursor arrow in pixels.
   * Height is derived automatically (ratio ≈ 1 : 1.5).
   * @default 36
   */
  size?: number;
  /**
   * Fill color of the cursor arrow.
   * @default '#FFFFFF'
   */
  color?: string;
  /**
   * Color used for the ripple ring on click.
   * @default '#00D4FF'
   */
  accentColor?: string;
  /**
   * How many frames the click scale-animation lasts before returning to 1.
   * @default 30
   */
  clickDurationFrames?: number;
};

// ---------------------------------------------------------------------------
// Easing presets
// ---------------------------------------------------------------------------

/** Symmetric ease-in-out — good for long cross-screen movements. */
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Ease-out cubic — natural deceleration on short arrival movements. */
const EASE_ARRIVE = Easing.bezier(0.33, 1, 0.68, 1);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the cursor coordinate along one axis at the given frame by finding
 * the active waypoint segment and applying per-segment easing.
 *
 * Long or fast segments use EASE_IN_OUT (anticipation + arrival feel).
 * Short or slow segments use EASE_ARRIVE (pure deceleration).
 */
function resolvePos(
  frame: number,
  sorted: CursorWaypoint[],
  axis: 'x' | 'y'
): number {
  if (!sorted.length) return 0;
  if (sorted.length === 1 || frame <= sorted[0].frame) return sorted[0][axis];

  const last = sorted[sorted.length - 1];
  if (frame >= last.frame) return last[axis];

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (frame >= a.frame && frame < b.frame) {
      const pixelDist = Math.abs(b[axis] - a[axis]);
      const frameDur = b.frame - a.frame;
      const isLongMove = pixelDist > 80 || frameDur > 30;
      return interpolate(frame, [a.frame, b.frame], [a[axis], b[axis]], {
        easing: isLongMove ? EASE_IN_OUT : EASE_ARRIVE,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }

  return last[axis];
}

/**
 * Returns the cursor scale for a click animation at a given waypoint frame.
 *
 * Phase 1 (press)  : linear compress to 0.6 over ~4 frames.
 * Phase 2 (release): spring bounce back to 1.0.
 */
function resolveClickScale(
  frame: number,
  atFrame: number,
  fps: number
): number {
  const elapsed = frame - atFrame;
  if (elapsed < 0) return 1;

  const pressFrames = Math.round(fps * 0.07); // ≈ 4 frames @ 60 fps

  if (elapsed < pressFrames) {
    return interpolate(elapsed, [0, pressFrames], [1, 0.6], {
      easing: Easing.in(Easing.quad),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  return spring({
    frame: elapsed - pressFrames,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
    from: 0.6,
    to: 1,
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * AnimatedCursor
 *
 * Renders a mouse-cursor arrow that travels between a list of waypoints using
 * smooth interpolation and plays a click animation (scale + ripple) at any
 * waypoint marked with `click: true`.
 *
 * @example
 * ```tsx
 * // Inside your composition, wrapped in a <Sequence> for timing control:
 * <Sequence from={100} durationInFrames={400}>
 *   <AnimatedCursor
 *     waypoints={[
 *       { frame: 0,   x: 200,  y: 300 },            // start position
 *       { frame: 60,  x: 860,  y: 490, click: true }, // move → click button
 *       { frame: 120, x: 950,  y: 620 },             // move to next element
 *       { frame: 180, x: 950,  y: 620, click: true }, // click again
 *     ]}
 *   />
 * </Sequence>
 * ```
 *
 * Coordinate tip: measure (x, y) from the top-left corner of the 1920 × 1080
 * canvas. The cursor hot spot (arrow tip) is placed exactly at those coordinates.
 */
export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  waypoints,
  size = 36,
  color = '#FFFFFF',
  accentColor = '#00D4FF',
  clickDurationFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sorted = [...waypoints].sort((a, b) => a.frame - b.frame);

  const x = resolvePos(frame, sorted, 'x');
  const y = resolvePos(frame, sorted, 'y');

  // Find the most recent active click waypoint (last wins if overlapping).
  const clickCandidates = sorted.filter(
    (w) => w.click && frame >= w.frame && frame < w.frame + clickDurationFrames
  );
  const activeClick = clickCandidates[clickCandidates.length - 1];

  const cursorScale = activeClick
    ? resolveClickScale(frame, activeClick.frame, fps)
    : 1;

  // Collect all waypoints whose ripple animation is still playing.
  const rippleDuration = Math.round(fps * 0.45);
  const activeRipples = sorted.filter(
    (w) => w.click && frame >= w.frame && frame < w.frame + rippleDuration
  );

  const rippleRadius = size * 1.6;

  return (
    <div
      style={{
        position: 'absolute',
        // Place the div's origin exactly at the cursor hot spot so that
        // left/top equal the canvas coordinates the cursor tip occupies.
        left: x,
        top: y,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* ── Ripple rings ─────────────────────────────────────────────────── */}
      {activeRipples.map((wp, i) => {
        const t = (frame - wp.frame) / rippleDuration;
        const ringScale = interpolate(t, [0, 1], [0.15, 2.2], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const ringOpacity = interpolate(t, [0, 0.35, 1], [0.75, 0.35, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -(rippleRadius / 2),
              top: -(rippleRadius / 2),
              width: rippleRadius,
              height: rippleRadius,
              borderRadius: '50%',
              border: `2px solid ${accentColor}`,
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
              transformOrigin: 'center',
            }}
          />
        );
      })}

      {/* ── Cursor arrow ─────────────────────────────────────────────────── */}
      {/*
        The scale transform origin is at (0, 0) so the arrow tip stays pinned
        during the click press/release animation.
      */}
      <div
        style={{
          transform: `scale(${cursorScale})`,
          transformOrigin: '0 0',
          display: 'inline-block',
          // Subtle drop shadow to lift the cursor off any background.
          filter: 'drop-shadow(1px 2px 6px rgba(0,0,0,0.55))',
        }}
      >
        <svg
          width={size}
          height={Math.round(size * 1.5)}
          viewBox="0 0 12 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/*
            Classic OS arrow cursor path.
            Hot spot = (0, 0) — the sharp tip at the top-left.

            Point walk (viewBox units):
              (0,0)  → tip
              (0,15) → bottom of left edge (straight down)
              (4,11) → notch entry (diagonal cut toward tail)
              (7,17) → tail tip
              (9.5,16) → tail right side
              (6.5,10) → notch exit (back up into body)
              (10,10) → outer right of arrow body
              Z      → closes back to tip (0,0) along the right edge of the head
          */}

          {/* Dark outline rendered behind fill for readability on any background */}
          <path
            d="M0 0L0 15L4 11L7 17L9.5 16L6.5 10L10 10Z"
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* White fill */}
          <path
            d="M0 0L0 15L4 11L7 17L9.5 16L6.5 10L10 10Z"
            fill={color}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
