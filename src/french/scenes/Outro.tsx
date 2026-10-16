import React from "react";
import { C, F, SHADOW, lerp, prog, spr } from "../theme";
import { FELICITATIONS_T } from "../timeline";
import { BookIcon, CheckIcon, Pill, Rays, ReplayIcon, SpeakerIcon, StarIcon, WordCard, popStyle, riseStyle } from "../ui";
import { Center, Scene } from "./Scene";

/* ---------------- La lettre H ---------------- */

export const LetterH: React.FC<{ t: number }> = ({ t }) => {
  const ghost = prog(t, 148.45, 0.8);
  const hIn = spr(t, 146.02, { damping: 10 });
  return (
    <Scene t={t} start={142.9} end={155.55}>
      <Center y={150}>
        <div style={riseStyle(t, 143.14)}>
          <Pill bg={C.blue} color={C.white} size={26}>
            <BookIcon size={30} /> RÈGLE DE LECTURE
          </Pill>
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 84, color: C.ink, marginTop: 14, ...riseStyle(t, 143.38) }}>
          Une règle importante
        </div>
      </Center>

      <div style={{ position: "absolute", top: 360, left: 330, display: "flex", alignItems: "center", gap: 70 }}>
        <div style={{ position: "relative", width: 230, height: 230, opacity: Math.min(1, hIn * 1.5), transform: `scale(${hIn})` }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 56,
              background: lerp(0, 1, ghost) > 0.5 ? C.paper2 : C.white,
              border: `6px ${ghost > 0.5 ? "dashed" : "solid"} ${ghost > 0.5 ? C.muted : C.blue}`,
              boxShadow: ghost > 0.5 ? "none" : SHADOW,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 170,
              color: C.blue,
            }}
          >
            <span style={{ opacity: 1 - ghost * 0.75, filter: `blur(${ghost * 2}px)` }}>H</span>
          </div>
          <div
            style={{
              position: "absolute",
              right: -34,
              top: -34,
              width: 96,
              height: 96,
              borderRadius: 48,
              background: C.white,
              boxShadow: SHADOW,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...popStyle(t, 148.45, 0.2, 0),
            }}
          >
            <SpeakerIcon t={t} size={62} color={C.ink} muted={prog(t, 148.6, 0.4)} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.ink, lineHeight: 1.15 }}>
            <span style={riseStyle(t, 147.01)}>La lettre H</span>
            <br />
            <span style={{ display: "inline-block", ...riseStyle(t, 148.15) }}>
              est <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.red }}>silencieuse</span>
            </span>
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 42, color: C.inkSoft, marginTop: 18, ...riseStyle(t, 149.76) }}>
            On ne la prononce{" "}
            <span style={{ color: C.red, fontWeight: 800, borderBottom: `5px solid ${C.red}` }}>jamais</span>.
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 625, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ ...riseStyle(t, 151.79), fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.inkSoft, letterSpacing: 2 }}>EXEMPLE</div>
        <WordCard t={t} start={152.99} word="homme" hl={[0, 1]} ipa="/ɔm/" ghost width={400} />
        <WordCard t={t} start={154.07} word="hôtel" hl={[0, 1]} ipa="/otɛl/" ghost width={400} />
      </div>
    </Scene>
  );
};

/* ---------------- Félicitations → À bientôt ---------------- */

const RECAP = [
  { t: 157.6, text: "L'alphabet", extra: "26 lettres" },
  { t: 158.4, text: "Les voyelles", extra: "a e i o u y" },
  { t: 159.2, text: "Les sons", extra: "oi · ou · ai / ei" },
  { t: 160.0, text: "La lettre h", extra: "muette" },
];

export const Outro: React.FC<{ t: number }> = ({ t }) => {
  const T = FELICITATIONS_T;
  const up = prog(t, 157.1, 0.7);
  const recapOut = prog(t, 161.3, 0.4);
  const replayOut = prog(t, 164.95, 0.35);
  return (
    <Scene t={t} start={155.55} end={169.5} fadeOutDur={0.01}>
      {/* Félicitations */}
      <Center y={lerp(300, 90, up)} style={{ transform: `scale(${lerp(1, 0.5, up)})`, opacity: 1 - recapOut }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rays t={t} size={1000 * spr(t, T, { damping: 18 }) * (1 - up)} />
          <div style={{ position: "relative", ...popStyle(t, T, 0.2, 0) }}>
            <StarIcon size={150} />
          </div>
          <div style={{ position: "relative", fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 160, color: C.ink, ...popStyle(t, T + 0.05) }}>
            Félicitations !
          </div>
        </div>
      </Center>

      {/* recap */}
      {t > 157 && t < 161.8 && (
        <div
          style={{
            position: "absolute",
            top: 400,
            left: 360,
            width: 1200,
            padding: "34px 50px",
            boxSizing: "border-box",
            borderRadius: 44,
            background: C.white,
            boxShadow: SHADOW,
            opacity: prog(t, 157.29, 0.4) * (1 - recapOut),
            transform: `translateY(${(1 - prog(t, 157.29, 0.5)) * 60}px)`,
          }}
        >
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.inkSoft, marginBottom: 18 }}>
            Vous connaissez maintenant les bases de la prononciation française :
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 50px" }}>
            {RECAP.map((r) => (
              <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 20, ...riseStyle(t, r.t, 20, 0.4) }}>
                <CheckIcon size={58} p={prog(t, r.t, 0.6)} />
                <div>
                  <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 42, color: C.ink }}>{r.text}</div>
                  <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 700, fontSize: 32, color: C.blue }}>{r.extra}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Répétez */}
      {t > 161.3 && t < 165.4 && (
        <Center y={300} style={{ opacity: prog(t, 161.53, 0.4) * (1 - replayOut) }}>
          <div style={popStyle(t, 161.53)}>
            <ReplayIcon size={170} rot={-t * 140} />
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 84, color: C.ink, marginTop: 30, ...riseStyle(t, 161.6) }}>
            Répétez cette vidéo
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 700, fontSize: 58, color: C.blue, ...riseStyle(t, 163.1) }}>
            autant de fois que nécessaire
          </div>
        </Center>
      )}

      {/* À bientôt */}
      {t > 164.9 && (
        <Center y={260}>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 200, color: C.ink, ...popStyle(t, 165.15, 0.6) }}>
            À bientôt !
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 50, color: C.inkSoft, ...riseStyle(t, 165.85) }}>
            pour le prochain cours
          </div>
          <div style={{ marginTop: 40, ...popStyle(t, 166.6) }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "20px 34px",
                borderRadius: 30,
                background: C.white,
                boxShadow: SHADOW,
                borderLeft: `12px solid ${C.red}`,
              }}
            >
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 30, color: C.red, letterSpacing: 2 }}>PROCHAINEMENT</div>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 40, color: C.ink }}>Cours 02</div>
            </div>
          </div>
        </Center>
      )}
    </Scene>
  );
};
