import React from "react";
import { AbsoluteFill } from "remotion";
import { PHRASES } from "./captions";
import { C, F, SHADOW, prog } from "./theme";
import { CHAPTERS } from "./timeline";
import { EqBars, FlagMark } from "./ui";

const GLYPHS = ["é", "ç", "à", "ê", "œ", "ô", "ù", "è", "û", "ë"];

export const Background: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        width: 1100,
        height: 1100,
        borderRadius: "50%",
        left: 1250 + Math.sin(t * 0.21) * 120,
        top: -520 + Math.cos(t * 0.17) * 90,
        background: `radial-gradient(circle, ${C.blue}2E 0%, ${C.blue}00 65%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 1000,
        height: 1000,
        borderRadius: "50%",
        left: -480 + Math.cos(t * 0.19) * 110,
        top: 420 + Math.sin(t * 0.23) * 90,
        background: `radial-gradient(circle, ${C.red}24 0%, ${C.red}00 65%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${C.ink}1A 2px, transparent 2.5px)`,
        backgroundSize: "44px 44px",
        backgroundPosition: `${(t * 6) % 44}px ${(t * 4) % 44}px`,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        opacity: 0.6,
      }}
    />
    {GLYPHS.map((g, i) => {
      const x = ((i * 211 + t * (8 + (i % 3) * 4)) % 2200) - 140;
      const y = 120 + ((i * 337) % 760) + Math.sin(t * 0.4 + i) * 30;
      return (
        <div
          key={g}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontFamily: F.serif,
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: 140 + (i % 4) * 50,
            color: C.ink,
            opacity: 0.035,
            transform: `rotate(${Math.sin(t * 0.3 + i) * 12}deg)`,
          }}
        >
          {g}
        </div>
      );
    })}
  </AbsoluteFill>
);

const chapterAt = (t: number) => {
  let idx = 0;
  CHAPTERS.forEach((c, i) => {
    if (t >= c.start) idx = i;
  });
  return idx;
};

export const Hud: React.FC<{ t: number }> = ({ t }) => {
  const idx = chapterAt(t);
  const ch = CHAPTERS[idx];
  const swap = prog(t, ch.start, 0.5);
  const intro = prog(t, 0.6, 0.8);
  const outro = 1 - prog(t, 168.2, 0.6);
  const vis = intro * outro;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* tricolour hairline */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex" }}>
        <div style={{ flex: 1, background: C.blue }} />
        <div style={{ flex: 1, background: C.white }} />
        <div style={{ flex: 1, background: C.red }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 44,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: vis,
          transform: `translateY(${(1 - intro) * -20}px)`,
        }}
      >
        <FlagMark h={34} />
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 28, color: C.ink, letterSpacing: 3 }}>FRANÇAIS</div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, color: C.inkSoft }}>· Cours 01</div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 38,
          opacity: vis,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 26px 12px 14px",
          borderRadius: 999,
          background: C.white,
          boxShadow: SHADOW,
          transform: `translateY(${(1 - intro) * -20}px)`,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            background: C.ink,
            color: C.white,
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${(1 - swap) * -180}deg)`,
          }}
        >
          {ch.num}
        </div>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 26,
            color: C.ink,
            opacity: swap,
            transform: `translateX(${(1 - swap) * 20}px)`,
          }}
        >
          {ch.label}
        </div>
      </div>
      {/* chapter progress */}
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 30, height: 8, display: "flex", gap: 8, opacity: vis }}>
        {CHAPTERS.map((c, i) => {
          const end = CHAPTERS[i + 1]?.start ?? 167.2;
          const p = Math.max(0, Math.min(1, (t - c.start) / (end - c.start)));
          return (
            <div key={c.id} style={{ flex: end - c.start, background: `${C.ink}14`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: i % 2 === 0 ? C.blue : C.red, borderRadius: 4 }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ t: number; showArabic: boolean }> = ({ t, showArabic }) => {
  const phrase = PHRASES.find((p) => t >= p.words[0][1] - 0.2 && t < p.end + 0.45);
  if (!phrase) return null;
  const start = phrase.words[0][1] - 0.2;
  const inP = prog(t, start, 0.3);
  const outP = prog(t, phrase.end + 0.2, 0.25);
  const vis = inP * (1 - outP);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 66,
        display: "flex",
        justifyContent: "center",
        opacity: vis,
        transform: `translateY(${(1 - inP) * 24 + outP * 10}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          maxWidth: 1760,
          padding: showArabic ? "16px 40px 14px 28px" : "20px 40px 20px 28px",
          borderRadius: 30,
          background: "rgba(255,255,255,0.92)",
          boxShadow: SHADOW,
          border: `2px solid ${C.line}`,
        }}
      >
        <EqBars />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 38, lineHeight: 1.25, textAlign: "center" }}>
            {phrase.words.map(([w, wt], i) => {
              const next = phrase.words[i + 1]?.[1] ?? phrase.end;
              const said = t >= wt;
              const current = said && t < next + 0.05;
              const p = prog(t, wt, 0.18);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    marginRight: 13,
                    color: said ? C.ink : C.muted,
                    position: "relative",
                    transform: `translateY(${current ? -2 * p : 0}px)`,
                  }}
                >
                  {current && (
                    <span
                      style={{
                        position: "absolute",
                        left: -6,
                        right: -6,
                        bottom: 4,
                        height: 14,
                        borderRadius: 7,
                        background: C.gold,
                        opacity: 0.55 * p,
                        zIndex: -1,
                      }}
                    />
                  )}
                  {w}
                </span>
              );
            })}
          </div>
          {showArabic && (
            <div dir="rtl" style={{ fontFamily: F.arabic, fontWeight: 500, fontSize: 30, color: C.inkSoft, lineHeight: 1.4 }}>
              {phrase.ar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tricolour bands sweeping across the frame (opening reveal / closing curtain).
export const Wipe: React.FC<{ t: number; start: number; mode: "reveal" | "cover" }> = ({ t, start, mode }) => {
  const colors = [C.blue, C.white, C.red];
  const anyVisible = mode === "reveal" ? t < start + 1.4 : t >= start;
  if (!anyVisible) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {colors.map((c, i) => {
        const p = prog(t, start + i * 0.12, 0.8);
        const x = mode === "reveal" ? p * 110 : (1 - p) * -110;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${i * 33.34 - 6 + x}%`,
              width: i < 2 ? "40%" : "48%",
              background: c,
              transform: "skewX(-8deg) scaleX(1.08)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

