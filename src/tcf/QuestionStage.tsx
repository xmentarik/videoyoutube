import React from "react";
import { AbsoluteFill } from "remotion";
import { Item, LETTERS, Question } from "./data";
import {
  AnnounceGlyph,
  Bars,
  CheckMark,
  Chip,
  F,
  K,
  Level,
  PhoneGlyph,
  SH,
  SpeakerGlyph,
  pop,
  prog,
  rise,
  spr,
} from "./ui";

type Props = { t: number; q: Question; doc: Item; ask: Item; count: Item; ans: Item };

const DOC_LABEL = { dialogue: "DIALOGUE", annonce: "ANNONCE", message: "MESSAGE VOCAL" } as const;
const PERSON = {
  Paul: { color: K.blue, soft: K.blueSoft, initial: "P" },
  Sophie: { color: K.red, soft: K.redSoft, initial: "S" },
} as const;

const Avatar: React.FC<{ who: "Paul" | "Sophie"; active: number; name?: string; size?: number }> = ({ who, active, name, size = 190 }) => {
  const p = PERSON[who];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: 0.45 + 0.55 * active }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: p.color,
          color: K.white,
          fontFamily: F.display,
          fontWeight: 900,
          fontSize: size * 0.48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 0 ${10 + active * 16}px ${p.color}${active > 0.5 ? "33" : "14"}, ${SH}`,
          transform: `scale(${0.92 + 0.08 * active})`,
        }}
      >
        {p.initial}
      </div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 34, color: K.ink }}>{name ?? who}</div>
    </div>
  );
};

/* ---------------- phase 1 : document (listening) ---------------- */

const DocPhase: React.FC<{ t: number; q: Question; doc: Item }> = ({ t, q, doc }) => {
  const out = prog(t, doc.end - 0.35, 0.35);
  // which dialogue line is being spoken (cue marks)
  let line = -1;
  doc.marks.forEach((m, i) => {
    if (t >= m - 0.05 && t <= doc.audioStart + doc.dur + 0.1) line = i;
  });
  const speaking = line >= 0 ? q.lines[line].who : null;
  const Glyph = q.docType === "message" ? PhoneGlyph : q.docType === "annonce" ? AnnounceGlyph : SpeakerGlyph;
  const voice = q.voice === "PAUL" ? "Paul" : "Sophie";
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.04})` }}>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={pop(t, doc.start + 0.1)}>
          <Chip bg={K.red} size={28}>
            <Glyph size={34} /> {DOC_LABEL[q.docType]}
          </Chip>
        </div>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 96, color: K.ink, marginTop: 26, ...rise(t, doc.start + 0.2) }}>
          Écoutez le document
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 700, fontSize: 46, color: K.red, ...rise(t, doc.start + 0.45) }}>
          une seule écoute, comme au vrai test
        </div>
      </div>
      <div style={{ position: "absolute", top: 590, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 90 }}>
        {q.docType === "dialogue" ? (
          <>
            <div style={pop(t, doc.start + 0.5)}>
              <Avatar who="Paul" active={speaking === "Paul" ? 1 : 0} />
            </div>
            <Level file={doc.file} audioStart={doc.audioStart} dur={doc.dur} t={t}>
              {(bars) => <Bars bars={bars} color={speaking === "Sophie" ? K.red : K.blue} h={170} w={18} />}
            </Level>
            <div style={pop(t, doc.start + 0.6)}>
              <Avatar who="Sophie" active={speaking === "Sophie" ? 1 : 0} />
            </div>
          </>
        ) : (
          <>
            <div style={pop(t, doc.start + 0.5)}>
              <Avatar who={voice} active={speaking ? 1 : 0} name={q.docType === "message" ? "Messagerie" : "Haut-parleur"} />
            </div>
            <Level file={doc.file} audioStart={doc.audioStart} dur={doc.dur} t={t}>
              {(bars) => <Bars bars={bars} color={PERSON[voice].color} h={170} w={18} />}
            </Level>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- phases 2-4 : question, countdown, answer ---------------- */

const Countdown: React.FC<{ t: number; count: Item }> = ({ t, count }) => {
  const local = t - count.start;
  const left = Math.max(0, Math.ceil(count.dur - local));
  const p = Math.min(1, local / count.dur);
  const tick = spr(t, count.start + Math.floor(local), { damping: 10, stiffness: 260 });
  const r = 74;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ position: "relative", width: 180, height: 180 }}>
        <svg width={180} height={180} viewBox="0 0 180 180" style={{ position: "absolute", inset: 0 }}>
          <circle cx={90} cy={90} r={r} fill={K.white} stroke={K.line} strokeWidth={14} />
          <circle
            cx={90}
            cy={90}
            r={r}
            fill="none"
            stroke={left <= 2 ? K.red : K.ink}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * p}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 86,
            color: left <= 2 ? K.red : K.ink,
            transform: `scale(${0.7 + 0.3 * tick})`,
          }}
        >
          {left}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 58, color: K.ink }}>À vous !</div>
        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 36, color: K.inkSoft }}>Choisissez votre réponse : A, B, C ou D</div>
      </div>
    </div>
  );
};

const AskPhase: React.FC<Props> = ({ t, q, ask, count, ans }) => {
  const inP = prog(t, ask.start, 0.5);
  const reveal = spr(t, ans.audioStart - 0.1, { damping: 12 });
  const revealed = t >= ans.audioStart - 0.1;
  const correct = LETTERS.indexOf(q.answer);
  const out = prog(t, ans.end - 0.4, 0.4);
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - out), transform: `translateY(${(1 - inP) * 30 - out * 20}px)` }}>
      <div style={{ position: "absolute", top: 170, left: 140, right: 140, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 34, color: K.red, letterSpacing: 3 }}>QUESTION {q.n}</div>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 70, lineHeight: 1.12, color: K.ink, marginTop: 6 }}>{q.prompt}</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 140,
          right: 140,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        {q.choices.map((choice, i) => {
          const L = LETTERS[i];
          const shown = spr(t, Math.max(ask.start + 0.2, (ask.marks[i] ?? ask.audioStart) - 0.15), { damping: 14 });
          const reading = !revealed && t >= (ask.marks[i] ?? 0) - 0.1 && t < (ask.marks[i + 1] ?? ask.audioStart + ask.dur);
          const isRight = i === correct;
          const bg = revealed && isRight ? K.green : K.white;
          return (
            <div
              key={L}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                height: 140,
                padding: "0 34px 0 22px",
                borderRadius: 34,
                background: bg,
                boxShadow: revealed && isRight ? `0 20px 40px ${K.green}55` : SH,
                border: `4px solid ${revealed && isRight ? K.green : reading ? K.ink : K.line}`,
                opacity: Math.min(1, shown * 1.5) * (revealed && !isRight ? 1 - 0.55 * reveal : 1),
                transform: `translateY(${(1 - shown) * 40}px) scale(${revealed && isRight ? 1 + 0.04 * reveal : reading ? 1.02 : 1})`,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  flexShrink: 0,
                  borderRadius: 26,
                  background: revealed && isRight ? K.white : reading ? K.ink : K.paper,
                  color: revealed && isRight ? K.green : reading ? K.white : K.ink,
                  fontFamily: F.display,
                  fontWeight: 900,
                  fontSize: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {L}
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: F.display,
                  fontWeight: 700,
                  fontSize: choice.length > 24 ? 38 : 44,
                  lineHeight: 1.15,
                  color: revealed && isRight ? K.white : K.ink,
                }}
              >
                {choice}
              </div>
              {revealed && isRight && <CheckMark size={70} p={prog(t, ans.audioStart, 0.6)} color={K.white} tick={K.green} />}
            </div>
          );
        })}
      </div>

      {/* bottom band: countdown, then explanation + transcript */}
      <div style={{ position: "absolute", top: 730, left: 140, right: 140, height: 260 }}>
        {t >= count.start - 0.2 && t < ans.audioStart && (
          <div style={{ display: "flex", justifyContent: "center", ...pop(t, count.start - 0.2, 0.8, 20) }}>
            <Countdown t={t} count={count} />
          </div>
        )}
        {revealed && (
          <div style={{ display: "flex", gap: 28, ...rise(t, ans.audioStart + 0.2, 30) }}>
            <div
              style={{
                flex: 1,
                borderRadius: 30,
                background: K.white,
                boxShadow: SH,
                padding: "24px 32px",
                borderLeft: `12px solid ${K.green}`,
              }}
            >
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26, color: K.green, letterSpacing: 2 }}>BONNE RÉPONSE : {q.answer}</div>
              <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 36, color: K.ink, lineHeight: 1.25, marginTop: 6 }}>
                {q.explanation || `${q.answer} : ${q.choices[correct]}.`}
              </div>
            </div>
            <div style={{ width: 760, borderRadius: 30, background: K.white, boxShadow: SH, padding: "22px 30px" }}>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 24, color: K.inkSoft, letterSpacing: 2, marginBottom: 6 }}>TRANSCRIPTION</div>
              {q.lines.map((l, i) => {
                const who = l.who === "Paul" || l.who === "Sophie" ? l.who : "Paul";
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 4, ...rise(t, ans.audioStart + 0.4 + i * 0.15, 14, 0.4) }}>
                    {q.docType === "dialogue" && (
                      <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 24, color: PERSON[who].color, minWidth: 92 }}>{l.who}</span>
                    )}
                    <span style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 700, fontSize: q.lines.length > 2 ? 26 : 30, color: K.ink, lineHeight: 1.25 }}>
                      « {l.text} »
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const QuestionStage: React.FC<Props> = (props) => {
  const { t, doc, ask, ans } = props;
  if (t < doc.start || t > ans.end) return null;
  return (
    <>
      {t < doc.end && <DocPhase t={t} q={props.q} doc={doc} />}
      {t >= ask.start - 0.05 && <AskPhase {...props} />}
    </>
  );
};
