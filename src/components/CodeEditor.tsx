import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { P } from "./palette";

// ─── TOKEN TYPES ─────────────────────────────────────────────────────────────

type Token = { t: string; c: string };
type CodeLine = Token[];

const K = P.synKeyword;
const T = P.synType;
const S = P.synString;
const N = P.synNumber;
const F = P.synFn;
const C = P.synComment;
const D = P.synDefault;
const O = P.synOperator;
const B = P.synBracket;

// ─── CODE CONTENT ────────────────────────────────────────────────────────────

const CODE: CodeLine[] = [
  [{ t: "import", c: K }, { t: " { spring, interpolate, Easing } ", c: D }, { t: "from", c: K }, { t: " ", c: D }, { t: "'remotion'", c: S }, { t: ";", c: D }],
  [],
  [{ t: "interface", c: K }, { t: " ", c: D }, { t: "SpringConfig", c: T }, { t: " {", c: B }],
  [{ t: "  damping", c: D }, { t: ": ", c: O }, { t: "number", c: T }, { t: ";", c: D }],
  [{ t: "  stiffness", c: D }, { t: ": ", c: O }, { t: "number", c: T }, { t: ";", c: D }],
  [{ t: "  mass", c: D }, { t: "?: ", c: O }, { t: "number", c: T }, { t: ";", c: D }],
  [{ t: "}", c: B }],
  [],
  [{ t: "const", c: K }, { t: " EXPO_OUT", c: D }, { t: ": ", c: O }, { t: "SpringConfig", c: T }, { t: " = {", c: B }],
  [{ t: "  damping", c: D }, { t: ": ", c: O }, { t: "100", c: N }, { t: ",", c: D }],
  [{ t: "  stiffness", c: D }, { t: ": ", c: O }, { t: "200", c: N }, { t: ",", c: D }],
  [{ t: "  mass", c: D }, { t: ": ", c: O }, { t: "0.5", c: N }, { t: ",", c: D }],
  [{ t: "};", c: B }],
  [],
  [{ t: "// Expo-out easing — starts fast, lands soft", c: C }],
  [{ t: "export const", c: K }, { t: " ", c: D }, { t: "useSceneTransition", c: F }, { t: " = (", c: B }],
  [{ t: "  frame", c: D }, { t: ": ", c: O }, { t: "number", c: T }, { t: ",", c: D }],
  [{ t: "  delay", c: D }, { t: ": ", c: O }, { t: "number", c: T }, { t: " = ", c: O }, { t: "0", c: N }],
  [{ t: ")", c: B }, { t: " => {", c: D }],
  [{ t: "  const", c: K }, { t: " progress ", c: D }, { t: "=", c: O }, { t: " spring", c: F }, { t: "({", c: B }],
  [{ t: "    frame", c: D }, { t: ": frame ", c: D }, { t: "-", c: O }, { t: " delay,", c: D }],
  [{ t: "    fps", c: D }, { t: ": ", c: O }, { t: "60", c: N }, { t: ",", c: D }],
  [{ t: "    config", c: D }, { t: ": EXPO_OUT,", c: D }],
  [{ t: "  });", c: B }],
  [],
  [{ t: "  return", c: K }, { t: " {", c: B }],
  [{ t: "    opacity", c: D }, { t: ": progress,", c: D }],
  [{ t: "    transform", c: D }, { t: ": ", c: O }, { t: "`scale(${progress})`", c: S }, { t: ",", c: D }],
  [{ t: "  };", c: B }],
  [{ t: "};", c: D }],
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const lineText = (tokens: Token[]) => tokens.map((tk) => tk.t).join("");

// How many chars are visible for a given line at this elapsed frame
// Returns: total elapsed chars consumed up to (not including) this line, or null if not yet started
function getVisibility(
  frame: number,
  editorStart: number
): { lineIdx: number; chars: number } {
  const CHARS_PER_FRAME = 3;
  const LINE_PAUSE = 5;

  let elapsed = frame - editorStart;
  if (elapsed <= 0) return { lineIdx: -1, chars: 0 };

  let cursor = 0;
  for (let i = 0; i < CODE.length; i++) {
    const len = lineText(CODE[i]).length;
    const lineDur = Math.ceil(len / CHARS_PER_FRAME);
    if (elapsed <= 0) return { lineIdx: i - 1, chars: len };
    if (elapsed <= lineDur + LINE_PAUSE) {
      const chars = Math.min(len, Math.floor(elapsed * CHARS_PER_FRAME));
      return { lineIdx: i, chars };
    }
    elapsed -= lineDur + LINE_PAUSE;
    cursor++;
  }
  return { lineIdx: CODE.length - 1, chars: 999 };
}

function renderTokens(tokens: Token[], visibleChars: number): React.ReactNode {
  if (tokens.length === 0) return null;
  const nodes: React.ReactNode[] = [];
  let seen = 0;
  for (let i = 0; i < tokens.length; i++) {
    const { t, c } = tokens[i];
    if (seen >= visibleChars) break;
    const visible = t.slice(0, visibleChars - seen);
    nodes.push(
      <span key={i} style={{ color: c }}>
        {visible}
      </span>
    );
    seen += t.length;
  }
  return nodes;
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────

const Caret: React.FC<{ frame: number }> = ({ frame }) => {
  const blink = Math.floor(frame / 18) % 2 === 0 ? 1 : 0.15;
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.1em",
        background: P.accent,
        verticalAlign: "text-bottom",
        marginLeft: 1,
        opacity: blink,
        boxShadow: `0 0 6px ${P.accent}`,
      }}
    />
  );
};

// ─── STATUS BAR ──────────────────────────────────────────────────────────────

const StatusBar: React.FC<{
  frame: number;
  visibleLines: number;
  compiling: boolean;
}> = ({ frame, visibleLines, compiling }) => {
  const compileDot = Math.floor(frame / 12) % 3;
  const dots = ".".repeat(compileDot + 1);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 16px",
        borderTop: `1px solid rgba(240,237,230,0.06)`,
        fontSize: 11,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: P.mutedLight,
        letterSpacing: "0.04em",
      }}
    >
      <span style={{ color: compiling ? P.accentOrange : P.synFn }}>
        {compiling ? `⬡ Compiling${dots}` : "✓ TypeScript"}
      </span>
      <span>
        Ln {visibleLines}, Col {(visibleLines * 3) % 40 + 1}
      </span>
      <span>UTF-8</span>
      <span>{(visibleLines * 0.18 + 0.4).toFixed(1)} KB</span>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

interface CodeEditorProps {
  enterFrame: number;
  compileFrame: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  enterFrame,
  compileFrame,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Spring-entrance from below
  const entryProgress = spring({
    frame: frame - enterFrame,
    fps: 60,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });

  const slideY = interpolate(entryProgress, [0, 1], [120, 0]);
  const editorOpacity = interpolate(entryProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const { lineIdx, chars } = getVisibility(frame, enterFrame + 10);

  // Lines fully visible up to lineIdx-1; lineIdx shows `chars` characters
  const fullyVisibleCount = lineIdx;

  const compiling = frame >= compileFrame && frame < compileFrame + 90;
  const compiled = frame >= compileFrame + 90;

  // Edge glow intensity pulses on compile
  const glowPulse = compiling
    ? 0.5 + 0.5 * Math.sin((frame - compileFrame) * 0.22)
    : compiled
    ? 0.4
    : 0.15;

  const W = Math.min(1100, width * 0.62);
  const H = Math.min(640, height * 0.68);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: editorOpacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(10, 14, 26, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid rgba(240,237,230,0.07)`,
          boxShadow: [
            `0 0 0 1px rgba(0,0,0,0.4)`,
            `0 32px 64px rgba(0,0,0,0.6)`,
            `0 0 80px rgba(0,212,255,${glowPulse * 0.18})`,
            `inset 0 0 60px rgba(0,212,255,${glowPulse * 0.04})`,
            `inset 0 1px 0 rgba(240,237,230,0.08)`,
          ].join(", "),
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.1s",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderBottom: `1px solid rgba(240,237,230,0.05)`,
            flexShrink: 0,
          }}
        >
          {/* Traffic lights */}
          {[P.synComment, "#FFB86C", P.synFn].map((col, i) => (
            <div
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: col,
                opacity: 0.7,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 12,
              color: P.mutedLight,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              letterSpacing: "0.06em",
            }}
          >
            scene-transition.ts
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: P.muted,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          >
            TypeScript React
          </span>
        </div>

        {/* Code body */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: 13.5,
            lineHeight: "1.7",
          }}
        >
          {/* Line numbers */}
          <div
            style={{
              width: 52,
              flexShrink: 0,
              padding: "16px 0",
              textAlign: "right",
              color: P.muted,
              fontSize: 12,
              borderRight: `1px solid rgba(240,237,230,0.04)`,
              userSelect: "none",
            }}
          >
            {CODE.map((_, i) => {
              const visible = i <= lineIdx;
              return (
                <div
                  key={i}
                  style={{
                    padding: "0 12px 0 0",
                    opacity: visible ? (i === lineIdx ? 1 : 0.45) : 0,
                    color: i === lineIdx ? P.accent : P.muted,
                    transition: "color 0.2s",
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          {/* Code text */}
          <div style={{ flex: 1, padding: "16px 20px", overflowY: "hidden" }}>
            {CODE.map((tokens, i) => {
              const fullyVisible = i < fullyVisibleCount;
              const currentLine = i === lineIdx;
              const notYet = i > lineIdx;

              if (notYet) return <div key={i} style={{ minHeight: "1.7em" }} />;

              return (
                <div
                  key={i}
                  style={{
                    minHeight: "1.7em",
                    whiteSpace: "pre",
                  }}
                >
                  {fullyVisible ? (
                    <span>
                      {tokens.map((tk, j) => (
                        <span key={j} style={{ color: tk.c }}>
                          {tk.t}
                        </span>
                      ))}
                    </span>
                  ) : currentLine ? (
                    <span>
                      {renderTokens(tokens, chars)}
                      <Caret frame={frame} />
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status bar */}
        <div style={{ flexShrink: 0 }}>
          <StatusBar
            frame={frame}
            visibleLines={Math.max(1, lineIdx + 1)}
            compiling={compiling}
          />
        </div>
      </div>
    </div>
  );
};
