import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const DURATION_S = 169.5;
export const W = 1920;
export const H = 1080;

export const C = {
  paper: "#FBF6EE",
  paper2: "#F2E9DA",
  ink: "#13203B",
  inkSoft: "#56607A",
  muted: "#B9BFCC",
  line: "#E6DDCC",
  blue: "#2450D6",
  blueDeep: "#183BA8",
  blueSoft: "#E3EAFF",
  red: "#E5383B",
  redDeep: "#B8232A",
  redSoft: "#FDE3E1",
  gold: "#F5B83D",
  goldSoft: "#FFF1D2",
  green: "#17A673",
  white: "#FFFFFF",
};

export const F = {
  display: "'Outfit', sans-serif",
  serif: "'Playfair Display', serif",
  arabic: "'Cairo', sans-serif",
  ipa: "'Noto Sans', sans-serif",
};

export const SHADOW = "0 18px 40px rgba(19,32,59,0.10), 0 2px 6px rgba(19,32,59,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

// Progress 0→1 between `start` and `start + dur` (seconds, absolute timeline).
export const prog = (t: number, start: number, dur = 0.5, easing = outExpo) =>
  interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing });

// Spring that starts at absolute second `start`.
export const spr = (
  t: number,
  start: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  t < start
    ? 0
    : spring({
        frame: (t - start) * FPS,
        fps: FPS,
        config: { damping: 13, stiffness: 170, mass: 0.8, ...config },
      });

// 1 until `end - dur`, then fades to 0 at `end`.
export const fadeOut = (t: number, end: number, dur = 0.4) => 1 - prog(t, end - dur, dur);

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
