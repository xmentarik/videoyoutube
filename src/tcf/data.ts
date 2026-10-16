import audioJson from "./audio.json";
import scriptJson from "./script.json";

// script.json  ← scripts/parse_tcf_script.py  (texte, questions, réponses)
// audio.json   ← scripts/measure_tcf_audio.py (durée réelle + repères de chaque fichier audio)
// Tant qu'un fichier audio manque, sa durée est estimée à partir du texte : la vidéo
// reste prévisualisable (muette) et se recale toute seule quand l'audio arrive.

export type Letter = "A" | "B" | "C" | "D";
export type Line = { who: string; text: string };
export type Question = {
  n: number;
  answer: Letter;
  docType: "dialogue" | "annonce" | "message";
  voice: "PAUL" | "SOPHIE" | "both";
  lines: Line[];
  prompt: string;
  choices: string[];
  explanation: string;
};
type Segment = { id: string; text: string; kind: string; q?: number; section?: number };
type AudioInfo = { file: string; duration: number; marks?: number[] };

export const SCRIPT = scriptJson as unknown as {
  sections: Record<string, { title: string; from: number; to: number }>;
  questions: Question[];
  segments: Segment[];
};
const AUDIO = audioJson as Record<string, AudioInfo>;

export const LETTERS: Letter[] = ["A", "B", "C", "D"];
export const COUNTDOWN_S = 5;

export type Item = {
  id: string;
  kind: string; // intro | section | pause | outro | document | question | countdown | answer
  start: number; // seconds: item becomes visible
  audioStart: number; // seconds: audio file starts
  dur: number; // audio duration (real or estimated)
  end: number; // seconds: item ends
  text: string;
  file?: string;
  marks: number[]; // absolute seconds of internal cues (choices A–D, dialogue lines…)
  q?: number;
  section?: number;
};

const estimate = (text: string) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  const stops = (text.match(/[.!?…:]/g) || []).length;
  return 0.6 + words * 0.42 + stops * 0.3;
};

// Fallback cue positions: proportional to where each piece starts in the text.
const proportionalMarks = (text: string, needles: string[], dur: number) => {
  let from = 0;
  return needles.map((n) => {
    const i = text.indexOf(n, from);
    const at = i < 0 ? from : i;
    from = at + 1;
    return (at / Math.max(1, text.length)) * dur;
  });
};

const LEAD: Record<string, number> = { document: 1.4, question: 0.5, answer: 0.3, section: 0.6, intro: 0.4, pause: 0.6, outro: 0.4 };
const TAIL: Record<string, number> = { document: 0.8, question: 0.3, answer: 2.2, section: 1.0, intro: 0.6, pause: 1.0, outro: 0.8 };

export const buildTimeline = () => {
  const items: Item[] = [];
  let t = 0.3;
  const qById = new Map(SCRIPT.questions.map((q) => [q.n, q]));
  for (const seg of SCRIPT.segments) {
    const a = AUDIO[seg.id];
    const dur = a ? a.duration : estimate(seg.text);
    const lead = LEAD[seg.kind] ?? 0.4;
    const tail = TAIL[seg.kind] ?? 0.6;
    const audioStart = t + lead;
    let marks: number[] = [];
    const q = seg.q ? qById.get(seg.q) : undefined;
    if (a?.marks) {
      marks = a.marks.map((m) => audioStart + m);
    } else if (q && seg.kind === "question") {
      marks = proportionalMarks(seg.text, LETTERS.map((l) => ` ${l} : `), dur).map((m) => audioStart + m);
    } else if (q && seg.kind === "document") {
      const joined = q.lines.map((l) => l.text).join(" ");
      marks = proportionalMarks(joined, q.lines.map((l) => l.text), dur).map((m) => audioStart + m);
    }
    items.push({
      id: seg.id,
      kind: seg.kind,
      start: t,
      audioStart,
      dur,
      end: audioStart + dur + tail,
      text: seg.text,
      file: a?.file,
      marks,
      q: seg.q,
      section: seg.section,
    });
    t = audioStart + dur + tail;
    if (seg.kind === "question") {
      items.push({ id: `q${seg.q}_countdown`, kind: "countdown", start: t, audioStart: t, dur: COUNTDOWN_S, end: t + COUNTDOWN_S, text: "", marks: [], q: seg.q });
      t += COUNTDOWN_S;
    }
  }
  return { items, total: t + 1.5 };
};

export const TIMELINE = buildTimeline();
export const HAS_AUDIO = Object.keys(AUDIO).length > 0;
export const question = (n: number) => SCRIPT.questions[n - 1];
export const sectionOf = (n: number) =>
  Object.entries(SCRIPT.sections).find(([, s]) => n >= s.from && n <= s.to)?.[0] ?? "1";
