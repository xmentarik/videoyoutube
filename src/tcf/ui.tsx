import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import React from "react";
import { random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { F, prog, spr } from "../french/theme";

export const K = {
  paper: "#F6F3EE",
  ink: "#0F1B2D",
  inkSoft: "#5A6475",
  muted: "#B7BDC8",
  line: "#E4DED3",
  red: "#D80621",
  redDeep: "#A3001A",
  redSoft: "#FCE4E6",
  blue: "#2450D6",
  blueSoft: "#E3EAFF",
  green: "#13A150",
  greenSoft: "#DFF6E8",
  gold: "#F5B83D",
  white: "#FFFFFF",
};

export const SH = "0 18px 40px rgba(15,27,45,0.10), 0 2px 6px rgba(15,27,45,0.06)";

export { F, prog, spr };

export const MapleLeaf: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 60,
  color = K.red,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M50 3 L57 17 Q59 21 63 19 L71 15 L67 36 Q66 41 71 38 L80 29 L83 37 Q84 41 88 40 L97 38 L91 52 Q89 56 93 58 L96 60 L74 77 Q71 80 73 84 L75 90 L53 86 L53 99 L47 99 L47 86 L25 90 L27 84 Q29 80 26 77 L4 60 L7 58 Q11 56 9 52 L3 38 L12 40 Q16 41 17 37 L20 29 L29 38 Q34 41 33 36 L29 15 L37 19 Q41 21 43 17 Z"
      fill={color}
    />
  </svg>
);

export const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  bg = K.ink,
  color = K.white,
  size = 24,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      padding: `${size * 0.38}px ${size * 0.85}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: F.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: size * 0.06,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const pop = (t: number, start: number, from = 0.6, dy = 30): React.CSSProperties => {
  const s = spr(t, start);
  return { opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * dy}px) scale(${from + (1 - from) * s})` };
};

export const rise = (t: number, start: number, dy = 36, dur = 0.55): React.CSSProperties => {
  const p = prog(t, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
};

/* Audio-reactive level for one segment file (falls back to a synthetic pulse while the audio is missing). */
const RealLevel: React.FC<{ file: string; startFrame: number; children: (l: number[]) => React.ReactNode }> = ({ file, startFrame, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = useAudioData(staticFile(file));
  if (!data) return <>{children(new Array(9).fill(0))}</>;
  const f = frame - startFrame;
  if (f < 0 || f / fps > data.durationInSeconds) return <>{children(new Array(9).fill(0))}</>;
  const spec = visualizeAudio({ fps, frame: f, audioData: data, numberOfSamples: 32, optimizeFor: "speed" });
  return <>{children(Array.from({ length: 9 }, (_, i) => Math.min(1, Math.sqrt(spec[i + 1]) * (1.7 + i * 0.3))))}</>;
};

export const Level: React.FC<{
  file?: string;
  audioStart: number;
  dur: number;
  t: number;
  children: (bars: number[]) => React.ReactNode;
}> = ({ file, audioStart, dur, t, children }) => {
  const { fps } = useVideoConfig();
  if (file) return <RealLevel file={file} startFrame={Math.round(audioStart * fps)}>{children}</RealLevel>;
  const on = t >= audioStart && t <= audioStart + dur;
  const bars = Array.from({ length: 9 }, (_, i) =>
    on ? 0.25 + 0.6 * Math.abs(Math.sin(t * (7 + i * 1.3) + i)) * random(`b${Math.floor(t * 8)}${i}`) : 0,
  );
  return <>{children(bars)}</>;
};

export const Bars: React.FC<{ bars: number[]; color: string; h?: number; w?: number }> = ({ bars, color, h = 120, w = 14 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: w * 0.6, height: h }}>
    {bars.map((b, i) => (
      <div key={i} style={{ width: w, height: Math.max(w, b * h), borderRadius: w / 2, background: color }} />
    ))}
  </div>
);

export const CheckMark: React.FC<{ size?: number; p: number; color?: string; tick?: string }> = ({ size = 56, p, color = K.green, tick = K.white }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx={28} cy={28} r={26} fill={color} opacity={Math.min(1, p * 2)} />
    <path
      d="M16 29l8 8 16-17"
      fill="none"
      stroke={tick}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={40}
      strokeDashoffset={40 * (1 - Math.max(0, p * 2 - 1))}
    />
  </svg>
);

export const SpeakerGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = K.white }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M8 24h10l14-11v38L18 40H8z" fill={color} />
    <path d="M40 22a14 14 0 0 1 0 20M47 15a24 24 0 0 1 0 34" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

export const PhoneGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = K.white }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path
      d="M18 6c3 0 5 6 7 11 1 3-3 6-3 8 2 6 9 13 15 15 2 0 5-4 8-3 5 2 11 4 11 7 0 4-5 13-12 13C26 57 7 38 7 18 7 11 14 6 18 6z"
      fill={color}
    />
  </svg>
);

export const AnnounceGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = K.white }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M6 26h8l30-16v44L14 38H6z" fill={color} />
    <path d="M16 39l5 16h8l-4-14" fill={color} />
    <path d="M52 24c4 4 4 12 0 16" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
