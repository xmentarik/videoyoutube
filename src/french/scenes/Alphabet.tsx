import React from "react";
import { C, F, SHADOW, prog, spr } from "../theme";
import { ALPHABET, BRAVO_T } from "../timeline";
import { Pill, SpeakerIcon, StarIcon, VoiceRing, popStyle, riseStyle } from "../ui";
import { Scene } from "./Scene";

/* ---------------- 26 lettres ---------------- */

export const AlphabetIntro: React.FC<{ t: number }> = ({ t }) => {
  const count = Math.round(26 * prog(t, 16.8, 0.9));
  const cx = 600;
  const cy = 470;
  const r = 270;
  return (
    <Scene t={t} start={14.75} end={22.9}>
      {/* rotating ring of letters with counter */}
      <div style={{ position: "absolute", left: cx - r - 60, top: cy - r - 60, width: (r + 60) * 2, height: (r + 60) * 2 }}>
        <div
          style={{
            position: "absolute",
            inset: 60,
            borderRadius: "50%",
            border: `3px dashed ${C.line}`,
            transform: `rotate(${t * 8}deg)`,
          }}
        />
        {ALPHABET.map((L, i) => {
          const a = (i / 26) * Math.PI * 2 - Math.PI / 2 + t * 0.12;
          const s = spr(t, 15.25 + i * 0.07, { damping: 12 });
          const lit = t >= 16.8 + (i / 26) * 0.9;
          return (
            <div
              key={L.l}
              style={{
                position: "absolute",
                left: r + 60 + Math.cos(a) * r - 32,
                top: r + 60 + Math.sin(a) * r - 32,
                width: 64,
                height: 64,
                borderRadius: 18,
                background: lit ? (L.vowel ? C.red : C.blue) : C.white,
                color: lit ? C.white : C.ink,
                boxShadow: SHADOW,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: Math.min(1, s * 1.5),
                transform: `scale(${s})`,
              }}
            >
              {L.l}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 220, color: C.ink, lineHeight: 1, ...popStyle(t, 16.6, 0.5) }}>
            {count}
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 56, color: C.red, ...riseStyle(t, 17.56, 20) }}>
            lettres
          </div>
        </div>
      </div>

      {/* sentence column */}
      <div style={{ position: "absolute", left: 1060, top: 250, width: 780 }}>
        <div style={riseStyle(t, 15.25)}>
          <Pill bg={C.blueSoft} color={C.blue}>
            L'ALPHABET FRANÇAIS
          </Pill>
        </div>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 74, lineHeight: 1.12, color: C.ink, marginTop: 28 }}>
          <span style={riseStyle(t, 15.25)}>En français, </span>
          <br />
          <span style={{ display: "inline-block", ...riseStyle(t, 16.42) }}>il y a </span>{" "}
          <span style={{ display: "inline-block", color: C.red, ...popStyle(t, 17.1) }}>26 lettres</span>
          <br />
          <span style={{ display: "inline-block", color: C.inkSoft, fontWeight: 600, ...riseStyle(t, 17.94) }}>dans l'alphabet.</span>
        </div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 44, color: C.inkSoft, marginTop: 40, ...riseStyle(t, 19.27) }}>
          Nous allons les lire <b style={{ color: C.blue }}>ensemble</b>.
        </div>
        <div style={{ marginTop: 40, ...popStyle(t, 21.5) }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 38px 16px 22px",
              borderRadius: 999,
              background: C.blue,
              color: C.white,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 50,
              boxShadow: `0 14px 0 ${C.blueDeep}`,
            }}
          >
            <SpeakerIcon t={t} size={64} color={C.white} />
            Écoutez bien !
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------------- A → Z ---------------- */

const COLS = 7;
const TILE = 124;
const GAP = 18;
const GX = 830;
const GY = 214;

const tilePos = (i: number) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const rowCount = row === 3 ? 26 - 3 * COLS : COLS;
  const offset = ((COLS - rowCount) * (TILE + GAP)) / 2;
  return { x: GX + offset + col * (TILE + GAP), y: GY + row * (TILE + GAP) };
};

export const AlphabetGrid: React.FC<{ t: number }> = ({ t }) => {
  let cur = -1;
  ALPHABET.forEach((L, i) => {
    if (t >= L.t - 0.05) cur = i;
  });
  const bravo = t >= BRAVO_T - 0.05;
  const L = cur >= 0 ? ALPHABET[cur] : null;
  const color = L?.vowel ? C.red : C.blue;
  const ls = L ? spr(t, L.t - 0.05, { damping: 11, stiffness: 200 }) : 0;
  const cardIn = spr(t, 22.75, { damping: 16 });

  return (
    <Scene t={t} start={22.75} end={71.5}>
      {/* focus card */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 196,
          width: 640,
          height: 660,
          borderRadius: 48,
          background: C.white,
          boxShadow: SHADOW,
          overflow: "hidden",
          transform: `translateX(${(1 - cardIn) * -200}px) rotate(${(1 - cardIn) * -4}deg)`,
          opacity: cardIn,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, background: bravo ? C.gold : color }} />
        {!bravo && L && (
          <>
            <div style={{ position: "absolute", left: 44, top: 46, right: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, color: C.inkSoft }}>
                Lettre <span style={{ color: C.ink }}>{String(cur + 1).padStart(2, "0")}</span> / 26
              </div>
              <Pill bg={L.vowel ? C.redSoft : C.blueSoft} color={color} size={22}>
                {L.vowel ? "VOYELLE" : "CONSONNE"}
              </Pill>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 330, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: L.vowel ? C.redSoft : C.blueSoft, transform: `scale(${0.6 + 0.4 * ls})` }} />
                <VoiceRing size={300} color={color} active={prog(t, L.t, 0.2) * (1 - prog(t, L.t + 1.2, 0.4))} />
                <div
                  style={{
                    position: "relative",
                    fontFamily: F.display,
                    fontWeight: 800,
                    fontSize: 250,
                    lineHeight: 1,
                    color,
                    transform: `scale(${0.4 + 0.6 * ls}) translateY(${(1 - ls) * 40}px)`,
                    opacity: Math.min(1, ls * 2),
                  }}
                >
                  {L.l}
                  <span style={{ fontSize: 130, color: `${color}88`, fontWeight: 700 }}>{L.l.toLowerCase()}</span>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", ...riseStyle(t, L.t + 0.05, 20, 0.35) }}>
              <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 80, color: C.ink }}>« {L.say} »</div>
              <div style={{ fontFamily: F.ipa, fontWeight: 500, fontSize: 40, color: C.inkSoft, marginTop: 4 }}>{L.ipa}</div>
            </div>
          </>
        )}
        {bravo && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={popStyle(t, BRAVO_T, 0.2, 0)}>
              <StarIcon size={190} />
            </div>
            <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 130, color: C.ink, ...popStyle(t, BRAVO_T + 0.08) }}>
              Bravo !
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 36, color: C.inkSoft, ...riseStyle(t, BRAVO_T + 0.25) }}>
              26 / 26 lettres
            </div>
          </div>
        )}
      </div>

      {/* grid */}
      {ALPHABET.map((A, i) => {
        const { x, y } = tilePos(i);
        const appear = spr(t, 22.8 + i * 0.022, { damping: 14 });
        const done = t >= A.t - 0.05;
        const active = i === cur && !bravo;
        const hit = spr(t, A.t - 0.05, { damping: 9, stiffness: 220 });
        const wave = bravo ? Math.sin(Math.max(0, Math.min(1, (t - BRAVO_T - i * 0.03) / 0.45)) * Math.PI) : 0;
        const col = A.vowel ? C.red : C.blue;
        const scale = appear * (active ? 1 + 0.14 * hit : 1) * (1 + wave * 0.12);
        return (
          <div
            key={A.l}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: TILE,
              height: TILE,
              borderRadius: 30,
              background: active ? col : done ? (A.vowel ? C.redSoft : C.blueSoft) : C.white,
              border: `3px solid ${done ? col : C.line}`,
              boxShadow: active ? `0 18px 34px ${col}55` : done ? "none" : SHADOW,
              color: active ? C.white : done ? col : C.muted,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 66,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: appear,
              transform: `translateY(${(1 - appear) * 40 - (active ? 10 * hit : 0) - wave * 26}px) scale(${scale})`,
              zIndex: active ? 2 : 1,
            }}
          >
            {A.l}
          </div>
        );
      })}

      {/* legend */}
      <div
        style={{
          position: "absolute",
          left: GX,
          top: GY + 4 * (TILE + GAP) + 28,
          width: COLS * (TILE + GAP) - GAP,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: F.display,
          fontWeight: 600,
          fontSize: 30,
          color: C.inkSoft,
          opacity: prog(t, 23.2, 0.5),
        }}
      >
        <div style={{ display: "flex", gap: 34 }}>
          <span>
            <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: 10, background: C.red, marginRight: 10 }} />
            voyelles
          </span>
          <span>
            <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: 10, background: C.blue, marginRight: 10 }} />
            consonnes
          </span>
        </div>
        <div style={{ width: 300, height: 14, borderRadius: 7, background: `${C.ink}12`, overflow: "hidden" }}>
          <div style={{ width: `${((cur + 1) / 26) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.red})`, borderRadius: 7 }} />
        </div>
      </div>
    </Scene>
  );
};
