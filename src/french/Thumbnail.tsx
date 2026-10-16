import React from "react";
import { AbsoluteFill } from "remotion";
import { useFonts } from "./fonts";
import { C, F, SHADOW } from "./theme";
import { FlagMark } from "./ui";

// YouTube thumbnail (1280×720) — same palette and type as the lesson video.

const Tile: React.FC<{ l: string; size: number; color: string; x: number; y: number; rot: number }> = ({
  l,
  size,
  color,
  x,
  y,
  rot,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: color,
      color: C.white,
      fontFamily: F.display,
      fontWeight: 900,
      fontSize: size * 0.68,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `rotate(${rot}deg)`,
      boxShadow: `0 ${size * 0.07}px 0 rgba(0,0,0,0.18), 0 30px 50px rgba(19,32,59,0.25)`,
    }}
  >
    {l}
  </div>
);

export const Thumbnail: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      {/* backdrop */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          right: -260,
          top: -220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blue}40 0%, ${C.blue}00 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          left: -300,
          bottom: -360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.red}33 0%, ${C.red}00 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.ink}1F 2px, transparent 2.5px)`,
          backgroundSize: "34px 34px",
          opacity: 0.6,
        }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, display: "flex" }}>
        <div style={{ flex: 1, background: C.blue }} />
        <div style={{ flex: 1, background: C.white }} />
        <div style={{ flex: 1, background: C.red }} />
      </div>

      {/* right: letter cluster */}
      <Tile l="A" size={230} color={C.red} x={805} y={105} rot={-9} />
      <Tile l="B" size={175} color={C.blue} x={1060} y={56} rot={8} />
      <Tile l="C" size={150} color={C.blueDeep} x={1085} y={268} rot={-6} />
      <div
        style={{
          position: "absolute",
          left: 770,
          top: 462,
          padding: "22px 40px 26px",
          borderRadius: 40,
          background: C.white,
          border: `6px solid ${C.ink}`,
          boxShadow: "0 24px 44px rgba(19,32,59,0.22)",
          transform: "rotate(-4deg)",
          fontFamily: F.serif,
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 84,
          color: C.ink,
          lineHeight: 1,
        }}
      >
        Bonjour <span style={{ color: C.red }}>!</span>
        <div
          style={{
            position: "absolute",
            left: 70,
            bottom: -34,
            width: 0,
            height: 0,
            borderLeft: "26px solid transparent",
            borderRight: "26px solid transparent",
            borderTop: `34px solid ${C.ink}`,
          }}
        />
      </div>

      {/* left: copy */}
      <div style={{ position: "absolute", left: 64, top: 52, display: "flex", alignItems: "center", gap: 14 }}>
        <FlagMark h={40} />
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 34, color: C.ink, letterSpacing: 4 }}>FRANÇAIS</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 128,
          padding: "10px 24px",
          borderRadius: 999,
          background: C.ink,
          color: C.white,
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
        }}
      >
        COURS 01 · DÉBUTANT
      </div>
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 196,
          fontFamily: F.serif,
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 136,
          lineHeight: 1,
          color: C.ink,
          letterSpacing: -2,
        }}
      >
        L'alphabet
      </div>
      <div style={{ position: "absolute", left: 64, top: 362, fontFamily: F.display, fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: C.ink }}>
        & la <span style={{ color: C.blue }}>prononciation</span>
      </div>
      <div style={{ position: "absolute", left: 64, top: 464, width: 104, height: 12, borderRadius: 6, background: C.red }} />
      <div style={{ position: "absolute", left: 64, bottom: 56, display: "flex", gap: 14 }}>
        {[
          { t: "26 lettres", c: C.blue },
          { t: "6 voyelles", c: C.red },
          { t: "oi · ou · ai", c: C.ink },
        ].map((x) => (
          <div
            key={x.t}
            style={{
              padding: "12px 24px",
              borderRadius: 20,
              background: C.white,
              boxShadow: SHADOW,
              border: `4px solid ${x.c}`,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 32,
              color: x.c,
            }}
          >
            {x.t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
