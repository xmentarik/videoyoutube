import React from "react";
import { C, F, SHADOW, prog, spr } from "../theme";
import { Pill, Rays, SpeakerIcon, popStyle, riseStyle } from "../ui";
import { Center, Scene } from "./Scene";

const SUB: [string, number][] = [
  ["et", 1.22],
  ["bienvenue", 1.52],
  ["dans", 2.1],
  ["votre", 2.42],
  ["premier", 3.02],
  ["cours", 3.4],
  ["de", 3.64],
];

const TOPICS = [
  { t: 7.76, n: "1", title: "L'alphabet", glyph: "Aa Bb Cc", color: C.blue },
  { t: 8.94, n: "2", title: "La prononciation", glyph: "/ʁ/ /y/ /ə/", color: C.red },
  { t: 10.62, n: "3", title: "Les sons de base", glyph: "ou · oi · ai", color: C.blueDeep },
];

export const Intro: React.FC<{ t: number }> = ({ t }) => {
  const hello = "Bonjour";
  const lift = prog(t, 4.75, 0.55);
  const cardsOut = prog(t, 11.95, 0.35);
  return (
    <Scene t={t} start={0} end={14.75} fadeIn={0.01}>
      {/* --- Bonjour --- */}
      <Center y={250} style={{ opacity: 1 - lift, transform: `translateY(${-lift * 80}px) scale(${1 - lift * 0.15})` }}>
        <div style={popStyle(t, 0.5)}>
          <Pill bg={C.ink} color={C.white} size={26}>
            COURS 01 · DÉBUTANT
          </Pill>
        </div>
        <div style={{ display: "flex", marginTop: 30, fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 240, lineHeight: 1.05 }}>
          {hello.split("").map((ch, i) => {
            const s = spr(t, 0.27 + i * 0.06, { damping: 11 });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: C.ink,
                  opacity: Math.min(1, s * 2),
                  transform: `translateY(${(1 - s) * 90}px) rotate(${(1 - s) * -12}deg)`,
                }}
              >
                {ch}
              </span>
            );
          })}
          <span style={{ color: C.red, display: "inline-block", ...popStyle(t, 0.75, 0.2, 0) }}>&nbsp;!</span>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 24, fontFamily: F.display, fontWeight: 500, fontSize: 56, color: C.inkSoft, alignItems: "baseline" }}>
          {SUB.map(([w, wt]) => (
            <span key={w} style={{ display: "inline-block", ...riseStyle(t, wt, 24, 0.4) }}>
              {w}
            </span>
          ))}
          <span
            style={{
              display: "inline-block",
              fontFamily: F.serif,
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: 72,
              color: C.blue,
              ...riseStyle(t, 3.96, 24, 0.4),
            }}
          >
            français
          </span>
        </div>
        <div
          style={{
            marginTop: 26,
            height: 8,
            width: 520 * prog(t, 4.0, 0.6),
            borderRadius: 4,
            background: `linear-gradient(90deg, ${C.blue} 33%, ${C.white} 33% 66%, ${C.red} 66%)`,
            boxShadow: "0 0 0 2px rgba(19,32,59,0.08)",
          }}
        />
      </Center>

      {/* --- Aujourd'hui : 3 topics --- */}
      {t > 5.1 && t < 12.5 && (
        <>
          <Center y={190} style={{ opacity: 1 - cardsOut }}>
            <div style={riseStyle(t, 5.32)}>
              <Pill bg={C.redSoft} color={C.red} size={26}>
                AUJOURD'HUI
              </Pill>
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 78, color: C.ink, marginTop: 22, ...riseStyle(t, 6.26) }}>
              Nous allons{" "}
              <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.blue }}>découvrir…</span>
            </div>
          </Center>
          <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 48 }}>
            {TOPICS.map((c, i) => {
              const s = spr(t, c.t);
              const out = spr(t, 11.95 + i * 0.06, { damping: 20 });
              return (
                <div
                  key={c.n}
                  style={{
                    width: 470,
                    height: 330,
                    borderRadius: 40,
                    background: C.white,
                    boxShadow: SHADOW,
                    padding: 36,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderTop: `10px solid ${c.color}`,
                    opacity: Math.min(1, s * 1.5) * (1 - out),
                    transform: `translateY(${(1 - s) * 120 + out * 160}px) rotate(${(1 - s) * (i - 1) * 6}deg)`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        background: c.color,
                        color: C.white,
                        fontFamily: F.display,
                        fontWeight: 800,
                        fontSize: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {c.n}
                    </div>
                    <div style={{ fontFamily: i === 1 ? F.ipa : F.serif, fontStyle: i === 1 ? "normal" : "italic", fontWeight: 700, fontSize: 40, color: `${c.color}AA` }}>
                      {c.glyph}
                    </div>
                  </div>
                  <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 50, color: C.ink, lineHeight: 1.1 }}>{c.title}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* --- Vous êtes prêts ? / C'est parti ! --- */}
      {t > 12.0 && (
        <>
          <Center y={330} style={{ opacity: 1 - prog(t, 13.2, 0.25) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 30, ...popStyle(t, 12.19, 0.7) }}>
              <SpeakerIcon t={t} size={110} color={C.blue} />
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 120, color: C.ink }}>
                Vous êtes prêts <span style={{ color: C.red }}>?</span>
              </div>
            </div>
          </Center>
          {t > 13.3 && (
            <Center y={300}>
              <div style={{ position: "relative", width: 1000, height: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Rays t={t} size={900 * spr(t, 13.37, { damping: 18 })} />
                <div
                  style={{
                    position: "relative",
                    padding: "34px 80px",
                    borderRadius: 40,
                    background: C.red,
                    color: C.white,
                    fontFamily: F.serif,
                    fontStyle: "italic",
                    fontWeight: 800,
                    fontSize: 140,
                    boxShadow: `0 24px 0 ${C.redDeep}, ${SHADOW}`,
                    transform: `scale(${0.3 + 0.7 * spr(t, 13.37, { damping: 9 })}) rotate(${-4 + (1 - spr(t, 13.37)) * -20}deg)`,
                  }}
                >
                  C'est parti !
                </div>
              </div>
            </Center>
          )}
        </>
      )}
    </Scene>
  );
};
