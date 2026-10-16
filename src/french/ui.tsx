import React from "react";
import { random } from "remotion";
import { C, F, SHADOW, prog, spr } from "./theme";
import { useVoice } from "./voice";

export const FlagMark: React.FC<{ h?: number }> = ({ h = 28 }) => (
  <div style={{ display: "flex", height: h, borderRadius: 6, overflow: "hidden", boxShadow: "0 0 0 2px rgba(19,32,59,0.08)" }}>
    <div style={{ width: h * 0.36, background: C.blue }} />
    <div style={{ width: h * 0.36, background: C.white }} />
    <div style={{ width: h * 0.36, background: C.red }} />
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = C.white, color = C.ink, size = 26, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      padding: `${size * 0.4}px ${size * 0.9}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: F.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: size * 0.04,
      boxShadow: bg === C.white ? SHADOW : "none",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Pop-in helper: scale/translate/opacity from a spring that starts at `start`.
export const popStyle = (t: number, start: number, from = 0.6, dy = 30): React.CSSProperties => {
  const s = spr(t, start);
  return {
    opacity: Math.min(1, s * 1.6),
    transform: `translateY(${(1 - s) * dy}px) scale(${from + (1 - from) * s})`,
  };
};

export const riseStyle = (t: number, start: number, dy = 40, dur = 0.6): React.CSSProperties => {
  const p = prog(t, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)`, filter: `blur(${(1 - p) * 6}px)` };
};

/* ---------- Icons ---------- */

export const SpeakerIcon: React.FC<{ size?: number; color?: string; t: number; muted?: number }> = ({
  size = 60,
  color = C.blue,
  t,
  muted = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M8 24h10l14-11v38L18 40H8z" fill={color} />
    {[0, 1, 2].map((i) => {
      const phase = ((t * 1.6 + i * 0.33) % 1 + 1) % 1;
      return (
        <path
          key={i}
          d={`M${38 + i * 7} ${22 - i * 5}a${12 + i * 7} ${12 + i * 7} 0 0 1 0 ${20 + i * 10}`}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={(1 - muted) * (0.25 + 0.75 * (1 - phase))}
        />
      );
    })}
    {muted > 0 && (
      <g stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={muted}>
        <path d={`M40 22 L${40 + 18 * muted} ${22 + 20 * muted}`} />
        <path d={`M${40 + 18 * muted} 22 L40 ${22 + 20 * muted}`} />
      </g>
    )}
  </svg>
);

export const CheckIcon: React.FC<{ size?: number; p: number }> = ({ size = 56, p }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx={28} cy={28} r={26} fill={C.green} opacity={Math.min(1, p * 2)} transform={`rotate(-90 28 28)`} />
    <path
      d="M16 29l8 8 16-17"
      fill="none"
      stroke={C.white}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={40}
      strokeDashoffset={40 * (1 - Math.max(0, p * 2 - 1))}
    />
  </svg>
);

export const WarningIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 6 L60 56 H4 Z" fill={C.gold} stroke={C.gold} strokeWidth={6} strokeLinejoin="round" />
    <rect x={29} y={23} width={6} height={18} rx={3} fill={C.ink} />
    <circle cx={32} cy={48} r={3.6} fill={C.ink} />
  </svg>
);

export const BookIcon: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M4 8c6-2 11-1 16 3v24c-5-4-10-5-16-3z" fill={color} />
    <path d="M36 8c-6-2-11-1-16 3v24c5-4 10-5 16-3z" fill={color} opacity={0.7} />
  </svg>
);

export const ReplayIcon: React.FC<{ size?: number; rot: number }> = ({ size = 120, rot }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: `rotate(${rot}deg)` }}>
    <circle cx={60} cy={60} r={56} fill={C.blue} />
    <path d="M60 30a30 30 0 1 1-28 19" fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" />
    <path d="M24 34 L34 52 L50 40 Z" fill={C.white} />
  </svg>
);

export const StarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 100, color = C.gold }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 6l12.6 27.2 29.8 3.4-22.2 20.2 6.2 29.4L50 71.3 23.6 86.2l6.2-29.4L7.6 36.6l29.8-3.4z"
      fill={color}
      stroke={color}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </svg>
);

// Soft sine wave — "le son est doux".
export const SoftWave: React.FC<{ t: number; w?: number; h?: number; color?: string; amp?: number }> = ({
  t,
  w = 120,
  h = 60,
  color = C.blue,
  amp = 1,
}) => {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = (i / 40) * w;
    const y = h / 2 + Math.sin(i / 40 * Math.PI * 3 + t * 5) * (h * 0.28) * amp * Math.sin((i / 40) * Math.PI);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={pts} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};

// Lips that round and push forward — "avancez les lèvres".
export const Lips: React.FC<{ round: number; size?: number }> = ({ round, size = 140 }) => {
  const rw = 52 - 22 * round;
  const rh = 16 + 16 * round;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 140 105">
      <ellipse cx={62} cy={52} rx={rw + 14} ry={rh + 12} fill={C.red} />
      <ellipse cx={62} cy={52} rx={rw} ry={rh * 0.55 + 2} fill={C.redDeep} />
      <path d={`M${62 - rw - 12} 52 Q62 ${48 - 2 * round} ${62 + rw + 12} 52`} stroke="#9E1C22" strokeWidth={3} fill="none" opacity={1 - round} />
      <g opacity={round}>
        <path d="M108 52 h24" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <path d="M124 42 l10 10 -10 10" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/* ---------- Audio-reactive ring ---------- */

export const VoiceRing: React.FC<{ size: number; color: string; active?: number }> = ({ size, color, active = 1 }) => {
  const { level } = useVoice();
  const l = level * active;
  return (
    <div style={{ position: "absolute", width: size, height: size, left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${6 - i * 1.5}px solid ${color}`,
            opacity: (0.35 - i * 0.1) * (0.4 + l),
            transform: `scale(${1 + l * (0.12 + i * 0.12) + i * 0.06})`,
          }}
        />
      ))}
    </div>
  );
};

export const EqBars: React.FC<{ color?: string; h?: number }> = ({ color = C.blue, h = 44 }) => {
  const { bars } = useVoice();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height: h }}>
      {bars.slice(0, 7).map((b, i) => (
        <div key={i} style={{ width: 6, borderRadius: 3, background: color, height: Math.max(6, b * h) }} />
      ))}
    </div>
  );
};

/* ---------- Confetti ---------- */

const CONFETTI_COLORS = [C.blue, C.red, C.gold, C.white, C.blueDeep, C.green];

export const Confetti: React.FC<{ t: number; start: number; seed: string; count?: number; x?: number; y?: number }> = ({
  t,
  start,
  seed,
  count = 140,
  x = 960,
  y = 460,
}) => {
  const dt = t - start;
  if (dt < 0 || dt > 4.5) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = 500 + random(`${seed}v${i}`) * 1100;
        const vx = Math.cos(a) * v;
        const vy = Math.sin(a) * v - 650;
        const drag = 1 - Math.exp(-dt * 2.2);
        const px = x + (vx / 2.2) * drag;
        const py = y + (vy / 2.2) * drag + 380 * dt * dt;
        const rot = random(`${seed}r${i}`) * 360 + dt * 500 * (random(`${seed}s${i}`) - 0.5) * 2;
        const w = 12 + random(`${seed}w${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * 0.45,
              borderRadius: 3,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              boxShadow: "0 0 0 1px rgba(19,32,59,0.06)",
              transform: `rotate(${rot}deg) rotateX(${dt * 720 + i * 20}deg)`,
              opacity: Math.min(1, (4.5 - dt) * 1.5),
            }}
          />
        );
      })}
    </div>
  );
};

// Rotating sunburst rays behind a stamp/title.
export const Rays: React.FC<{ t: number; size: number; color?: string; opacity?: number }> = ({
  t,
  size,
  color = C.gold,
  opacity = 0.35,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="-100 -100 200 200"
    style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) rotate(${t * 12}deg)`, opacity }}
  >
    {Array.from({ length: 16 }, (_, i) => (
      <path key={i} d="M0 0 L-9 -100 L9 -100 Z" fill={color} transform={`rotate(${i * 22.5})`} />
    ))}
  </svg>
);

/* ---------- Word card with highlighted letters ---------- */

export const WordCard: React.FC<{
  t: number;
  start: number;
  word: string;
  hl: [number, number]; // [from, to) indices to highlight
  ipa: string;
  color?: string;
  ghost?: boolean; // highlighted part is silent
  width?: number;
}> = ({ t, start, word, hl, ipa, color = C.red, ghost = false, width = 380 }) => {
  const s = spr(t, start);
  const glow = prog(t, start + 0.15, 0.5);
  const pre = word.slice(0, hl[0]);
  const mid = word.slice(hl[0], hl[1]);
  const post = word.slice(hl[1]);
  return (
    <div
      style={{
        width,
        padding: "26px 20px 22px",
        borderRadius: 32,
        background: C.white,
        boxShadow: SHADOW,
        textAlign: "center",
        opacity: Math.min(1, s * 1.6),
        transform: `translateY(${(1 - s) * 50}px) scale(${0.7 + 0.3 * s})`,
      }}
    >
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 92, lineHeight: 1.05, color: C.ink }}>
        {pre}
        <span
          style={{
            color: ghost ? C.muted : color,
            opacity: ghost ? 1 - glow * 0.55 : 1,
            textDecoration: ghost ? "line-through" : "none",
            textDecorationColor: C.red,
            textDecorationThickness: 6,
            borderBottom: ghost ? "none" : `${6 * glow}px solid ${color}`,
          }}
        >
          {mid}
        </span>
        {post}
      </div>
      <div style={{ fontFamily: F.ipa, fontSize: 34, color: C.inkSoft, marginTop: 8, opacity: glow }}>{ipa}</div>
    </div>
  );
};

// Letter tile used by the sounds scene.
export const LetterTile: React.FC<{ letter: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  letter,
  size = 170,
  color = C.blue,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.22,
      background: C.white,
      boxShadow: `${SHADOW}, inset 0 -8px 0 ${color}22`,
      border: `4px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.display,
      fontWeight: 800,
      fontSize: size * 0.62,
      color,
      ...style,
    }}
  >
    {letter}
  </div>
);
