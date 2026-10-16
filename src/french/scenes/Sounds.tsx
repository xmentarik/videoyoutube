import React from "react";
import { C, F, SHADOW, prog, spr } from "../theme";
import { LetterTile, Pill, VoiceRing, WordCard, popStyle, riseStyle } from "../ui";
import { Center, Scene } from "./Scene";

type Step = {
  start: number;
  end: number;
  ordinal: string;
  groups: { letters: string; t: number }[];
  orT?: number;
  resultT: number;
  result: string;
  ipa: string;
  examples: { word: string; hl: [number, number]; ipa: string; t: number }[];
};

const STEPS: Step[] = [
  {
    start: 111.8,
    end: 122.65,
    ordinal: "Premier son",
    groups: [{ letters: "OI", t: 113.47 }],
    resultT: 117.85,
    result: "wa",
    ipa: "/wa/",
    examples: [
      { word: "moi", hl: [1, 3], ipa: "/mwa/", t: 119.98 },
      { word: "toi", hl: [1, 3], ipa: "/twa/", t: 121.36 },
    ],
  },
  {
    start: 122.65,
    end: 133.3,
    ordinal: "Deuxième son",
    groups: [{ letters: "OU", t: 124.19 }],
    resultT: 128.25,
    result: "ou",
    ipa: "/u/",
    examples: [
      { word: "bonjour", hl: [4, 6], ipa: "/bɔ̃ʒuʁ/", t: 130.52 },
      { word: "vous", hl: [1, 3], ipa: "/vu/", t: 131.83 },
    ],
  },
  {
    start: 133.3,
    end: 142.95,
    ordinal: "Troisième son",
    groups: [
      { letters: "AI", t: 134.85 },
      { letters: "EI", t: 136.13 },
    ],
    orT: 135.65,
    resultT: 137.95,
    result: "è",
    ipa: "/ɛ/",
    examples: [
      { word: "mais", hl: [1, 3], ipa: "/mɛ/", t: 140.23 },
      { word: "neige", hl: [1, 3], ipa: "/nɛʒ/", t: 141.48 },
    ],
  },
];

const SoundStep: React.FC<{ t: number; step: Step; index: number }> = ({ t, step, index }) => {
  const eq = spr(t, step.resultT - 0.55);
  const res = spr(t, step.resultT, { damping: 9 });
  const resultActive = prog(t, step.resultT, 0.2) * (1 - prog(t, step.resultT + 1.0, 0.4));
  return (
    <Scene t={t} start={step.start} end={step.end} fadeIn={0.5}>
      <Center y={225}>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 64, color: C.red, ...riseStyle(t, step.start + 0.2) }}>
          {step.ordinal}
        </div>
      </Center>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 44 }}>
        {step.groups.map((g, gi) => (
          <React.Fragment key={g.letters}>
            {gi > 0 && (
              <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 56, color: C.inkSoft, ...popStyle(t, step.orT ?? g.t) }}>ou</div>
            )}
            <div style={{ display: "flex", gap: 14, position: "relative" }}>
              {g.letters.split("").map((ch, i) => {
                const s = spr(t, g.t - 0.1 + i * 0.12, { damping: 11 });
                // tiles click together when the rule is spoken
                const join = spr(t, step.resultT - 0.9, { damping: 16 });
                return (
                  <div
                    key={i}
                    style={{
                      opacity: Math.min(1, s * 1.5),
                      transform: `translateY(${(1 - s) * -120}px) rotate(${(1 - s) * (i ? 18 : -18)}deg) translateX(${join * (i ? -7 : 7)}px)`,
                    }}
                  >
                    <LetterTile letter={ch} size={step.groups.length > 1 ? 150 : 180} />
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 120, color: C.ink, opacity: eq, transform: `scale(${eq})` }}>=</div>
        <div style={{ position: "relative", opacity: Math.min(1, res * 1.5), transform: `scale(${0.3 + 0.7 * res})` }}>
          <VoiceRing size={330} color={C.red} active={resultActive} />
          <div
            style={{
              position: "relative",
              minWidth: 300,
              height: 190,
              padding: "0 40px",
              boxSizing: "border-box",
              borderRadius: 95,
              background: C.red,
              boxShadow: `0 16px 0 ${C.redDeep}, ${SHADOW}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: C.white,
            }}
          >
            <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 110, lineHeight: 1 }}>« {step.result} »</div>
            <div style={{ fontFamily: F.ipa, fontSize: 32, opacity: 0.85 }}>{step.ipa}</div>
          </div>
          <div style={{ position: "absolute", bottom: -62, left: 0, right: 0, textAlign: "center", fontFamily: F.display, fontWeight: 700, fontSize: 30, color: C.inkSoft }}>
            on prononce
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 625, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ ...riseStyle(t, step.examples[0].t - 1.0), fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.inkSoft, letterSpacing: 2 }}>
          EXEMPLE
        </div>
        {step.examples.map((e) => (
          <WordCard key={e.word} t={t} start={e.t} word={e.word} hl={e.hl} ipa={e.ipa} width={e.word.length > 5 ? 440 : 340} />
        ))}
      </div>
      {/* step dots */}
      <Center y={160}>
        <div style={{ display: "flex", gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === index ? 54 : 16,
                height: 16,
                borderRadius: 8,
                background: i <= index ? C.red : `${C.ink}22`,
              }}
            />
          ))}
        </div>
      </Center>
    </Scene>
  );
};

export const Sounds: React.FC<{ t: number }> = ({ t }) => {
  const chips = [
    { s: "oi", t: 108.38 },
    { s: "ou", t: 109.26 },
    { s: "ai · ei", t: 110.0 },
  ];
  return (
    <>
      <Scene t={t} start={106.65} end={111.85}>
        <Center y={250}>
          <div style={riseStyle(t, 106.91)}>
            <Pill bg={C.ink} color={C.white} size={28}>
              PASSONS MAINTENANT AUX…
            </Pill>
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 130, color: C.ink, marginTop: 24, ...popStyle(t, 108.2, 0.7) }}>
            combinaisons de sons
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 46, color: C.inkSoft, ...riseStyle(t, 109.76) }}>
            très fréquentes en français
          </div>
          <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
            {chips.map((c) => (
              <div
                key={c.s}
                style={{
                  ...popStyle(t, c.t),
                  padding: "18px 44px",
                  borderRadius: 30,
                  background: C.white,
                  boxShadow: SHADOW,
                  border: `4px solid ${C.blue}`,
                  fontFamily: F.serif,
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: 64,
                  color: C.blue,
                }}
              >
                {c.s}
              </div>
            ))}
          </div>
        </Center>
      </Scene>
      {STEPS.map((s, i) => (
        <SoundStep key={s.ordinal} t={t} step={s} index={i} />
      ))}
    </>
  );
};
