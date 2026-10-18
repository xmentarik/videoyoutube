import scriptJson from "./script.json";
import timingJson from "./timing.json";

// script.json  ← scripts/parse_dialogues.py   (40 dialogues, lines, sections, vocabulary)
// timing.json  ← scripts/align_dialogues.py   (when each line is spoken in public/dialogues/partN.wav)

export type Who = "Paul" | "Sophie";
export type Line = { who: Who; text: string };
export type Dialogue = { n: number; title: string; section: number; lines: Line[] };
export type Section = { n: number; title: string; from: number; to: number; theme: string; vocab: string[] };

export const SCRIPT = scriptJson as unknown as { sections: Section[]; dialogues: Dialogue[] };
const TIMING = timingJson as unknown as Record<string, { file: string; lines: [number, number][] }>;

// Where the conversation happens (drives the background and the characters' props).
export type Place = "bureau" | "telephone" | "magasin";
export const placeOf = (n: number): Place => (n >= 35 && n <= 37 ? "telephone" : n >= 38 ? "magasin" : "bureau");

const INTRO_S = 7;
const SECTION_S = 4.5;
const TITLE_S = 1.8; // dialogue title before the first line
const PAD_IN = 0.15; // audio kept before the first line / after the last one
const PAD_OUT = 0.3;
const TAIL_S = 1.3;
const OUTRO_S = 7;

export type Spoken = Line & { start: number; end: number }; // absolute seconds
export type DialogueItem = {
  kind: "dialogue";
  d: Dialogue;
  start: number; // title card appears
  audioStart: number; // absolute time the audio clip starts
  clipFrom: number; // seconds into the part file
  clipDur: number;
  file: string;
  lines: Spoken[];
  end: number;
};
export type CardItem = { kind: "intro" | "section" | "outro"; start: number; end: number; section?: Section };
export type Item = DialogueItem | CardItem;

const build = () => {
  const items: Item[] = [{ kind: "intro", start: 0, end: INTRO_S }];
  let t = INTRO_S;
  for (const section of SCRIPT.sections) {
    items.push({ kind: "section", start: t, end: t + SECTION_S, section });
    t += SECTION_S;
    for (const d of SCRIPT.dialogues.filter((x) => x.section === section.n)) {
      const tm = TIMING[`d${String(d.n).padStart(2, "0")}`];
      const clipFrom = Math.max(0, tm.lines[0][0] - PAD_IN);
      const clipTo = tm.lines[tm.lines.length - 1][1] + PAD_OUT;
      const audioStart = t + TITLE_S;
      const lines = d.lines.map((l, i) => ({ ...l, start: audioStart + tm.lines[i][0] - clipFrom, end: audioStart + tm.lines[i][1] - clipFrom }));
      const end = audioStart + (clipTo - clipFrom) + TAIL_S;
      items.push({ kind: "dialogue", d, start: t, audioStart, clipFrom, clipDur: clipTo - clipFrom, file: tm.file, lines, end });
      t = end;
    }
  }
  items.push({ kind: "outro", start: t, end: t + OUTRO_S });
  return { items, total: t + OUTRO_S };
};

export const TIMELINE = build();
export const DIALOGUES = TIMELINE.items.filter((i): i is DialogueItem => i.kind === "dialogue");
