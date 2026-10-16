import React from "react";
import { AbsoluteFill } from "remotion";
import { prog } from "../theme";

// Mounts its children only between `start` and `end` (absolute seconds),
// with a soft rise-in and a lift-out so consecutive scenes cross-dissolve.
export const Scene: React.FC<{
  t: number;
  start: number;
  end: number;
  children: React.ReactNode;
  fadeIn?: number;
  fadeOutDur?: number;
}> = ({ t, start, end, children, fadeIn = 0.45, fadeOutDur = 0.4 }) => {
  if (t < start || t > end) return null;
  const pin = prog(t, start, fadeIn);
  const pout = prog(t, end - fadeOutDur, fadeOutDur);
  return (
    <AbsoluteFill
      style={{
        opacity: pin * (1 - pout),
        transform: `translateY(${(1 - pin) * 30 - pout * 30}px) scale(${1 - pout * 0.03})`,
        filter: pout > 0 || pin < 1 ? `blur(${(1 - pin) * 8 + pout * 8}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Absolutely positioned, horizontally centred block.
export const Center: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  y,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);
