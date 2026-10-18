import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useFonts } from "../french/fonts";
import { F, prog } from "../french/theme";
import { Pose } from "./Characters";
import { DIALOGUES, DialogueItem, Item, SCRIPT, TIMELINE, Who, placeOf } from "./data";
import { Bubble, D, DialogueTitle, Intro, Outro, SectionCard, Stage } from "./Scenes";

const { items, total } = TIMELINE;

// Idle life: blink every few seconds (offset per character), slight breathing tilt.
const idle = (t: number, seed: number, look: number): Pose => {
  const cycle = (t + seed) % 3.7;
  const blink = cycle < 0.14 ? Math.sin((cycle / 0.14) * Math.PI) : 0;
  return { mouth: 0, blink, look, tilt: Math.sin(t * 1.3 + seed) * 1.2, brow: 0 };
};

const cast = (t: number, speaking: Who | null, level: number) => {
  const paul = idle(t, 0, 1);
  const sophie = idle(t, 1.9, -1);
  const talk = (p: Pose): Pose => ({ ...p, mouth: level, tilt: p.tilt + Math.sin(t * 6) * 1.5 * level, brow: Math.min(1, level * 1.4) });
  return { paul: speaking === "Paul" ? talk(paul) : paul, sophie: speaking === "Sophie" ? talk(sophie) : sophie };
};

/* One dialogue on set: mouth driven by the loudness of its audio clip. */
const DialogueScene: React.FC<{ it: DialogueItem; t: number }> = ({ it, t }) => {
  const { fps } = useVideoConfig();
  const data = useAudioData(staticFile(it.file));
  const line = it.lines.find((l) => t >= l.start && t <= l.end) ?? null;
  const shown = [...it.lines].reverse().find((l) => t >= l.start - 0.1) ?? null; // bubble stays until the next line
  let level = 0;
  if (data && line) {
    const fileT = it.clipFrom + (t - it.audioStart);
    const spec = visualizeAudio({ fps, frame: Math.round(fileT * fps), audioData: data, numberOfSamples: 16, optimizeFor: "speed" });
    level = Math.min(1, Math.sqrt((spec[1] + spec[2] + spec[3]) / 3) * 2.4);
  }
  const place = placeOf(it.d.n);
  return (
    <AbsoluteFill>
      <Stage place={place} cast={cast(t, line?.who ?? null, level)} speaking={line?.who ?? null} />
      {shown && <Bubble key={shown.start} t={t} who={shown.who} text={shown.text} start={shown.start - 0.1} split={place === "telephone"} />}
      {t < it.audioStart && <DialogueTitle t={t} start={it.start} end={it.audioStart} n={it.d.n} title={it.d.title} />}
    </AbsoluteFill>
  );
};

const Hud: React.FC<{ t: number }> = ({ t }) => {
  const current = DIALOGUES.find((d) => t >= d.start && t <= d.end);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ padding: "10px 22px", borderRadius: 999, background: D.ink, color: D.white, fontFamily: F.display, fontWeight: 800, fontSize: 24, letterSpacing: 2 }}>FRANÇAIS A1</div>
        <div style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.85)", color: D.ink, fontFamily: F.display, fontWeight: 700, fontSize: 24 }}>L'entretien d'embauche</div>
      </div>
      {current && t >= current.audioStart - 0.3 && (
        <div style={{ position: "absolute", right: 40, top: 30, display: "flex", gap: 12, alignItems: "center", opacity: prog(t, current.audioStart - 0.3, 0.3) }}>
          <div style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.85)", color: D.ink, fontFamily: F.display, fontWeight: 700, fontSize: 24 }}>{current.d.title}</div>
          <div style={{ padding: "10px 22px", borderRadius: 999, background: D.coral, color: D.white, fontFamily: F.display, fontWeight: 800, fontSize: 24, letterSpacing: 1 }}>
            DIALOGUE {current.d.n} <span style={{ opacity: 0.7 }}>/ {SCRIPT.dialogues.length}</span>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 22, display: "flex", gap: 4 }}>
        {DIALOGUES.map((d, i) => {
          const p = prog(t, d.audioStart, Math.max(0.1, d.end - d.audioStart), (x) => x);
          return (
            <div key={d.d.n} style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(29,36,51,0.18)", overflow: "hidden", marginLeft: i % 10 === 0 && i ? 10 : 0 }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: p >= 1 ? D.teal : D.coral }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const at = (t: number) => items.find((i) => t >= i.start && t < i.end) ?? items[items.length - 1];

export const DialoguesVideo: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cur: Item = at(t);
  const idleStage = (place: "bureau" | "magasin") => <Stage place={place} cast={cast(t, null, 0)} speaking={null} />;

  return (
    <AbsoluteFill style={{ background: D.paper, fontFamily: F.display }}>
      {cur.kind === "dialogue" && <DialogueScene it={cur} t={t} />}
      {cur.kind === "intro" && (
        <>
          {idleStage("bureau")}
          <Intro t={t} start={cur.start} end={cur.end} />
        </>
      )}
      {cur.kind === "section" && cur.section && (
        <>
          {idleStage("bureau")}
          <SectionCard t={t} start={cur.start} end={cur.end} section={cur.section} />
        </>
      )}
      {cur.kind === "outro" && (
        <>
          {idleStage("magasin")}
          <Outro t={t} start={cur.start} />
        </>
      )}
      {cur.kind !== "intro" && cur.kind !== "section" && <Hud t={t} />}

      {DIALOGUES.map((d) => (
        <Sequence key={d.d.n} from={Math.round(d.audioStart * fps)} durationInFrames={Math.ceil(d.clipDur * fps)} layout="none">
          <Audio src={staticFile(d.file)} trimBefore={Math.round(d.clipFrom * fps)} durationInFrames={Math.ceil(d.clipDur * fps)} />
        </Sequence>
      ))}
      {items
        .filter((i) => i.kind === "section" || i.kind === "outro")
        .map((i) => (
          <Sequence key={`w${i.start}`} from={Math.round(i.start * fps)} durationInFrames={Math.round(1.6 * fps)} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} />
          </Sequence>
        ))}
      {DIALOGUES.map((d) => (
        <Sequence key={`p${d.d.n}`} from={Math.round((d.start + 0.05) * fps)} durationInFrames={Math.round(1.2 * fps)} layout="none">
          <Audio src={staticFile("sfx/pop.wav")} volume={0.15} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const DIALOGUES_DURATION_S = total;
