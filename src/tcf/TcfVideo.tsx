import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useFonts } from "../french/fonts";
import { Item, SCRIPT, TIMELINE, question, sectionOf } from "./data";
import { QuestionStage } from "./QuestionStage";
import { Halfway, Intro1, Intro2, Intro3, Outro1, Outro2, SectionCard } from "./Scenes";
import { Chip, F, K, MapleLeaf, SH, prog } from "./ui";

const { items, total } = TIMELINE;

// Per question: document → question → countdown → answer.
const STAGES = SCRIPT.questions.map((q) => {
  const of = (kind: string) => items.find((i) => i.q === q.n && i.kind === kind) as Item;
  return { q, doc: of("document"), ask: of("question"), count: of("countdown"), ans: of("answer") };
});

const SCENES: Record<string, React.FC<{ t: number; it: Item }>> = {
  intro_01: Intro1,
  intro_02: Intro2,
  intro_03: Intro3,
  pause_milieu: Halfway,
  outro_01: Outro1,
  outro_02: Outro2,
};

type Sfx = { t: number; src: string; v: number };
const SFX: Sfx[] = [
  ...items.filter((i) => i.kind === "section" || i.id === "pause_milieu").map((i) => ({ t: i.start, src: "whoosh", v: 0.25 })),
  ...items.filter((i) => i.kind === "document").map((i) => ({ t: i.start + 0.1, src: "whoosh", v: 0.15 })),
  ...items.filter((i) => i.kind === "countdown").flatMap((i) => [0, 1, 2, 3, 4].map((k) => ({ t: i.start + k, src: "pop", v: 0.16 }))),
  ...items.filter((i) => i.kind === "answer").map((i) => ({ t: i.audioStart - 0.1, src: "chime", v: 0.18 })),
];

const Background: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: K.paper, overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        width: 1200,
        height: 1200,
        right: -500 + Math.sin(t * 0.15) * 80,
        top: -600,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${K.red}22 0%, ${K.red}00 65%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${K.ink}18 2px, transparent 2.5px)`,
        backgroundSize: "44px 44px",
        backgroundPosition: `${(t * 5) % 44}px 0px`,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        opacity: 0.6,
      }}
    />
    <MapleLeaf size={900} color={K.red} style={{ position: "absolute", left: -260, bottom: -320, opacity: 0.04, transform: `rotate(${-18 + Math.sin(t * 0.1) * 4}deg)` }} />
  </AbsoluteFill>
);

const Hud: React.FC<{ t: number }> = ({ t }) => {
  const current = STAGES.find((s) => t >= s.doc.start && t <= s.ans.end);
  const done = STAGES.filter((s) => t > s.ans.audioStart).length;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, display: "flex" }}>
        <div style={{ width: "25%", background: K.red }} />
        <div style={{ flex: 1, background: K.white }} />
        <div style={{ width: "25%", background: K.red }} />
      </div>
      <div style={{ position: "absolute", left: 64, top: 44, display: "flex", alignItems: "center", gap: 14 }}>
        <MapleLeaf size={42} />
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 30, color: K.ink, letterSpacing: 3 }}>TCF CANADA</div>
        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 26, color: K.inkSoft }}>· Compréhension orale · A1</div>
      </div>
      {current && (
        <div style={{ position: "absolute", right: 64, top: 36, display: "flex", gap: 14, alignItems: "center" }}>
          <Chip bg={K.white} color={K.inkSoft} size={22} style={{ boxShadow: SH }}>
            SECTION {sectionOf(current.q.n)}
          </Chip>
          <Chip bg={K.ink} size={26} style={{ boxShadow: SH }}>
            QUESTION {current.q.n} <span style={{ opacity: 0.55 }}>/ 40</span>
          </Chip>
        </div>
      )}
      {/* 40 ticks: one per question */}
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 30, display: "flex", gap: 5 }}>
        {STAGES.map((s, i) => {
          const p = prog(t, s.doc.start, Math.max(0.1, s.ans.audioStart - s.doc.start), (x) => x);
          return (
            <div key={s.q.n} style={{ flex: 1, height: 10, borderRadius: 5, background: `${K.ink}14`, overflow: "hidden", marginLeft: i % 10 === 0 && i ? 10 : 0 }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: i < done ? K.green : K.red }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const TcfVideo: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = items.filter((i) => t >= i.start && t <= i.end);

  return (
    <AbsoluteFill style={{ fontFamily: F.display, color: K.ink }}>
      <Background t={t} />
      {active.map((it) => {
        const Scene = SCENES[it.id];
        if (Scene) return <Scene key={it.id} t={t} it={it} />;
        if (it.kind === "section") return <SectionCard key={it.id} t={t} it={it} />;
        return null;
      })}
      {STAGES.filter((s) => t >= s.doc.start && t <= s.ans.end).map((s) => (
        <QuestionStage key={s.q.n} t={t} q={question(s.q.n)} doc={s.doc} ask={s.ask} count={s.count} ans={s.ans} />
      ))}
      <Hud t={t} />

      {items
        .filter((i) => i.file)
        .map((i) => (
          <Sequence key={i.id} from={Math.round(i.audioStart * fps)} durationInFrames={Math.max(1, Math.ceil(i.dur * fps) + 2)} layout="none">
            <Audio src={staticFile(i.file as string)} />
          </Sequence>
        ))}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} durationInFrames={Math.round(1.6 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const TCF_DURATION_S = total;
