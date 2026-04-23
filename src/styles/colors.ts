export const C = {
  bg:      '#F4EFEA',
  text:    '#1A1A1A',
  accent:  '#C5542D',
  lines:   '#D8D0C8',
  white:   '#FFFFFF',
  dim:     '#8A8075',
  bgDark:  '#1A1A1A',
} as const;

export const F = {
  serif: '"Playfair Display", Georgia, "Times New Roman", serif',
  sans:  '"Inter", "Helvetica Neue", Arial, sans-serif',
} as const;

// Scene timing at 30 fps
export const SCENES = {
  hook:       { from: 0,   dur: 60  },  // 0–2s
  problems:   { from: 60,  dur: 90  },  // 2–5s
  website:    { from: 150, dur: 60  },  // 5–7s
  solution:   { from: 210, dur: 120 },  // 7–11s
  navigation: { from: 330, dur: 150 },  // 11–16s
  contact:    { from: 480, dur: 120 },  // 16–20s
  final:      { from: 600, dur: 120 },  // 20–24s
} as const;

export const W = 1080;
export const H = 1920;
