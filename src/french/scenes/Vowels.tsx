import React from "react";
import { C, F, SHADOW, lerp, prog, spr } from "../theme";
import { VOWELS } from "../timeline";
import { Lips, Pill, SoftWave, VoiceRing, WarningIcon, WordCard, popStyle, riseStyle } from "../ui";
import { Center, Scene } from "./Scene";

/* ---------------- 6 voyelles ---------------- */

export const Vowels: React.FC<{ t: number }> = ({ t }) => {
  const up = prog(t, 77.2, 0.7);
  let cur = -1;
  VOWELS.forEach((v, i) => {
    if (t >= v.t - 0.05) cur = i;
  });
  return (
    <Scene t={t} start={71.2} end={87.2}>
      <Center y={lerp(250, 150, up)} style={{ transform: `scale(${lerp(1, 0.78, up)})` }}>
        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 44, color: C.inkSoft, ...riseStyle(t, 71.3) }}>Maintenant, regardons…</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 170, color: C.ink, lineHeight: 1.1, ...popStyle(t, 72.82, 0.6) }}>
          les voyelles
        </div>
        <div style={{ marginTop: 16, ...popStyle(t, 75.86) }}>
          <Pill bg={C.red} color={C.white} size={34}>
            6 VOYELLES EN FRANÇAIS
          </Pill>
        </div>
      </Center>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 46 }}>
        {VOWELS.map((v, i) => {
          const s = spr(t, v.t - 0.05, { damping: 10 });
          const active = i === cur;
          return (
            <div key={v.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.5) }}>
              <div
                style={{
                  position: "relative",
                  width: 200,
                  height: 200,
                  transform: `translateY(${(1 - s) * 80}px) scale(${s * (active ? 1.08 : 1)})`,
                }}
              >
                {active && <VoiceRing size={200} color={C.red} />}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: active ? `radial-gradient(circle at 35% 30%, #FF6B6E, ${C.red} 60%, ${C.redDeep})` : C.white,
                    border: `5px solid ${C.red}`,
                    boxShadow: active ? `0 22px 40px ${C.red}55` : SHADOW,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: F.display,
                    fontWeight: 800,
                    fontSize: 120,
                    color: active ? C.white : C.red,
                  }}
                >
                  {v.l}
                </div>
              </div>
              <div style={{ fontFamily: F.ipa, fontWeight: 500, fontSize: 38, color: C.inkSoft, marginTop: 22 }}>{v.ipa}</div>
              {v.l === "Y" && (
                <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 700, fontSize: 30, color: C.red }}>« i grec »</div>
              )}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* ---------------- E et U ---------------- */

const LetterHead: React.FC<{ letter: string; color: string; soft: string; title: string; sub: string }> = ({
  letter,
  color,
  soft,
  title,
  sub,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: 42,
        background: color,
        color: C.white,
        fontFamily: F.display,
        fontWeight: 800,
        fontSize: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 14px 0 ${soft}`,
      }}
    >
      {letter}
    </div>
    <div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 54, color: C.ink }}>{title}</div>
      <div style={{ fontFamily: F.ipa, fontWeight: 500, fontSize: 36, color: C.inkSoft }}>{sub}</div>
    </div>
  </div>
);

export const EtU: React.FC<{ t: number }> = ({ t }) => {
  const focusU = prog(t, 100.1, 0.5);
  const both = prog(t, 106.0, 0.3);
  const eFocus = 1 - 0.55 * focusU * (1 - both);
  const uFocus = lerp(0.45, 1, Math.max(focusU, both));
  const dim = prog(t, 93.8, 0.4);
  const card = (letter: "E" | "U", start: number, focus: number): React.CSSProperties => {
    const s = spr(t, start, { damping: 14 });
    const f = lerp(1, focus, dim);
    return {
      position: "absolute",
      top: 250,
      width: 760,
      height: 600,
      left: letter === "E" ? 150 : 1010,
      borderRadius: 48,
      background: C.white,
      boxShadow: SHADOW,
      padding: 44,
      boxSizing: "border-box",
      borderTop: `12px solid ${letter === "E" ? C.blue : C.red}`,
      opacity: Math.min(1, s * 1.5) * lerp(0.4, 1, f),
      transform: `translateY(${(1 - s) * 120}px) scale(${lerp(0.93, 1, f)})`,
      filter: `saturate(${lerp(0.3, 1, f)})`,
    };
  };
  const pout = 0.5 + 0.5 * Math.sin((t - 101.94) * 4.5 - Math.PI / 2);
  const lipsRound = t < 101.94 ? 0 : t > 103.3 ? 1 : pout;

  return (
    <Scene t={t} start={87.2} end={106.65}>
      <Center y={130}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ ...popStyle(t, 87.43, 0.3, 0), transform: `${popStyle(t, 87.43, 0.3, 0).transform} rotate(${Math.sin(Math.max(0, t - 87.43) * 18) * 10 * (1 - prog(t, 87.43, 1.2))}deg)` }}>
            <WarningIcon size={86} />
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 72, color: C.ink, ...riseStyle(t, 87.43) }}>
            Attention !{" "}
            <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.red, ...riseStyle(t, 88.64) }}>2 voyelles très importantes</span>
          </div>
        </div>
      </Center>

      {/* E */}
      <div style={card("E", 91.0, eFocus)}>
        <LetterHead letter="E" color={C.blue} soft={C.blueSoft} title="La lettre E" sub="/ə/" />
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 40, ...riseStyle(t, 95.42) }}>
          <SoftWave t={t} w={130} h={64} color={C.blue} amp={0.6} />
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 48, color: C.ink }}>
            Le son est <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.blue }}>doux</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 28 }}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 36, color: C.inkSoft, width: 300, ...riseStyle(t, 97.07) }}>
            E comme dans le mot…
          </div>
          <WordCard t={t} start={99.0} word="le" hl={[1, 2]} ipa="/lə/" color={C.blue} width={300} />
        </div>
      </div>

      {/* U */}
      <div style={card("U", 92.42, uFocus)}>
        <LetterHead letter="U" color={C.red} soft={C.redSoft} title="La lettre U" sub="/y/" />
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30, ...riseStyle(t, 101.94) }}>
          <Lips round={lipsRound} size={130} />
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 48, color: C.ink }}>
            Avancez les <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.red }}>lèvres</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 14 }}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 36, color: C.inkSoft, width: 300, ...riseStyle(t, 103.6) }}>
            U comme dans le mot…
            <div style={{ marginTop: 10, ...popStyle(t, 105.95) }}>
              <Pill bg={C.redSoft} color={C.red} size={24}>
                u ≠ ou
              </Pill>
            </div>
          </div>
          <WordCard t={t} start={105.5} word="tu" hl={[1, 2]} ipa="/ty/" color={C.red} width={300} />
        </div>
      </div>
    </Scene>
  );
};
