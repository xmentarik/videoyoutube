import React from "react";
import { AbsoluteFill } from "remotion";
import { useFonts } from "../french/fonts";
import { LETTERS, PARTS } from "./data";
import { CheckMark, F, K, MapleLeaf } from "./ui";

// YouTube thumbnail (1280×720) for one part of the TCF Canada A1 series — same palette and type as the video.
// `sample` = the question shown on the card (pick one with a short prompt).

const Headphones: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M14 62 V52 a36 36 0 0 1 72 0 V62" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <rect x={6} y={56} width={22} height={36} rx={9} fill={color} />
    <rect x={72} y={56} width={22} height={36} rx={9} fill={color} />
  </svg>
);

const Choice: React.FC<{ l: string; text: string; right?: boolean }> = ({ l, text, right }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "10px 16px",
      borderRadius: 22,
      background: right ? K.green : K.white,
      border: `4px solid ${right ? K.green : K.line}`,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        background: right ? K.white : K.paper,
        color: right ? K.green : K.ink,
        fontFamily: F.display,
        fontWeight: 900,
        fontSize: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {l}
    </div>
    <div style={{ flex: 1, fontFamily: F.display, fontWeight: 800, fontSize: 32, color: right ? K.white : K.ink }}>{text}</div>
    {right && <CheckMark size={48} p={1} color={K.white} tick={K.green} />}
  </div>
);

export const TcfThumbnail: React.FC<{ part: number; sample: number }> = ({ part, sample }) => {
  useFonts();
  const q = PARTS[part].question(sample);
  return (
    <AbsoluteFill style={{ background: K.paper, overflow: "hidden" }}>
      {/* backdrop */}
      <MapleLeaf size={760} color={K.red} style={{ position: "absolute", right: -170, top: -40, opacity: 0.08, transform: "rotate(12deg)" }} />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          left: -380,
          bottom: -460,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${K.red}2E 0%, ${K.red}00 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${K.ink}1A 2px, transparent 2.5px)`,
          backgroundSize: "34px 34px",
          opacity: 0.6,
        }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, display: "flex" }}>
        <div style={{ flex: 1, background: K.red }} />
        <div style={{ flex: 2, background: K.white }} />
        <div style={{ flex: 1, background: K.red }} />
      </div>

      {/* left: copy */}
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 16 }}>
        <MapleLeaf size={70} />
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 64, lineHeight: 1, color: K.ink, letterSpacing: 1 }}>
          TCF <span style={{ color: K.red }}>CANADA</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 56, top: 150, fontFamily: F.display, fontWeight: 900, lineHeight: 0.86, color: K.ink, letterSpacing: -4 }}>
        <div style={{ fontSize: 250, color: K.red }}>40</div>
        <div style={{ fontSize: 96, letterSpacing: -1 }}>QUESTIONS</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 500,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 26px 12px 18px",
          borderRadius: 999,
          background: K.ink,
          color: K.white,
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 2,
        }}
      >
        <Headphones size={44} color={K.white} />
        COMPRÉHENSION ORALE
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 48,
          fontFamily: F.serif,
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1,
          color: K.ink,
        }}
      >
        avec <span style={{ color: K.green }}>réponses</span>
      </div>
      <div style={{ position: "absolute", left: 500, bottom: 50 }}>
        <CheckMark size={64} p={1} />
      </div>

      {/* right: question card */}
      <div
        style={{
          position: "absolute",
          left: 660,
          top: 140,
          width: 560,
          padding: "26px 30px 28px",
          borderRadius: 40,
          background: K.white,
          boxShadow: "0 30px 60px rgba(15,27,45,0.22), 0 4px 10px rgba(15,27,45,0.08)",
          transform: "rotate(3deg)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: K.red }}>QUESTION {q.n}</div>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 44, lineHeight: 1.05, color: K.ink, marginBottom: 6 }}>{q.prompt.replace(/ ([?!:])/g, "\u00a0$1")}</div>
        {q.choices.map((c, i) => (
          <Choice key={c} l={LETTERS[i]} text={c} right={LETTERS[i] === q.answer} />
        ))}
      </div>

      {/* level badge */}
      <div
        style={{
          position: "absolute",
          left: 1080,
          top: 40,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: K.red,
          border: `8px solid ${K.white}`,
          boxShadow: "0 18px 36px rgba(163,0,26,0.35)",
          transform: "rotate(-10deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: K.white,
          fontFamily: F.display,
          fontWeight: 900,
        }}
      >
        <div style={{ fontSize: 76, lineHeight: 0.9 }}>A1</div>
        <div style={{ fontSize: 22, letterSpacing: 2 }}>DÉBUTANT</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 66,
          padding: "10px 24px",
          borderRadius: 18,
          background: K.gold,
          color: K.ink,
          fontFamily: F.display,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: 2,
          transform: "rotate(-3deg)",
          boxShadow: "0 12px 24px rgba(15,27,45,0.18)",
        }}
      >
        PARTIE {part}
      </div>
    </AbsoluteFill>
  );
};
