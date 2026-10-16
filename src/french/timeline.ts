// All timings are in seconds, measured on public/voiceover.wav
// (Whisper word timestamps snapped to silence-detection onsets).

export type Chapter = { id: string; num: string; label: string; start: number };

export const CHAPTERS: Chapter[] = [
  { id: "intro", num: "01", label: "Introduction", start: 0 },
  { id: "alphabet", num: "02", label: "L'alphabet", start: 14.9 },
  { id: "voyelles", num: "03", label: "Les voyelles", start: 71.1 },
  { id: "eu", num: "04", label: "E et U", start: 87.2 },
  { id: "sons", num: "05", label: "Les sons", start: 106.7 },
  { id: "h", num: "06", label: "La lettre H", start: 142.9 },
  { id: "outro", num: "07", label: "Bravo !", start: 155.6 },
];

export type Letter = { l: string; t: number; say: string; ipa: string; vowel: boolean };

export const ALPHABET: Letter[] = [
  { l: "A", t: 23.47, say: "a", ipa: "/a/", vowel: true },
  { l: "B", t: 24.78, say: "bé", ipa: "/be/", vowel: false },
  { l: "C", t: 26.32, say: "cé", ipa: "/se/", vowel: false },
  { l: "D", t: 28.11, say: "dé", ipa: "/de/", vowel: false },
  { l: "E", t: 29.95, say: "e", ipa: "/ə/", vowel: true },
  { l: "F", t: 31.6, say: "effe", ipa: "/ɛf/", vowel: false },
  { l: "G", t: 33.19, say: "gé", ipa: "/ʒe/", vowel: false },
  { l: "H", t: 35.11, say: "ache", ipa: "/aʃ/", vowel: false },
  { l: "I", t: 36.93, say: "i", ipa: "/i/", vowel: true },
  { l: "J", t: 38.56, say: "ji", ipa: "/ʒi/", vowel: false },
  { l: "K", t: 40.47, say: "ka", ipa: "/ka/", vowel: false },
  { l: "L", t: 42.18, say: "elle", ipa: "/ɛl/", vowel: false },
  { l: "M", t: 44.0, say: "emme", ipa: "/ɛm/", vowel: false },
  { l: "N", t: 45.77, say: "enne", ipa: "/ɛn/", vowel: false },
  { l: "O", t: 47.58, say: "o", ipa: "/o/", vowel: true },
  { l: "P", t: 49.36, say: "pé", ipa: "/pe/", vowel: false },
  { l: "Q", t: 51.2, say: "qu", ipa: "/ky/", vowel: false },
  { l: "R", t: 53.1, say: "erre", ipa: "/ɛʁ/", vowel: false },
  { l: "S", t: 55.07, say: "esse", ipa: "/ɛs/", vowel: false },
  { l: "T", t: 56.96, say: "té", ipa: "/te/", vowel: false },
  { l: "U", t: 58.84, say: "u", ipa: "/y/", vowel: true },
  { l: "V", t: 60.69, say: "vé", ipa: "/ve/", vowel: false },
  { l: "W", t: 62.58, say: "double vé", ipa: "/dubləve/", vowel: false },
  { l: "X", t: 64.75, say: "ixe", ipa: "/iks/", vowel: false },
  { l: "Y", t: 66.49, say: "i grec", ipa: "/iɡʁɛk/", vowel: true },
  { l: "Z", t: 68.39, say: "zède", ipa: "/zɛd/", vowel: false },
];

export const BRAVO_T = 70.21;

export const VOWELS = [
  { l: "A", t: 77.71, ipa: "/a/" },
  { l: "E", t: 79.16, ipa: "/ə/" },
  { l: "I", t: 80.69, ipa: "/i/" },
  { l: "O", t: 82.38, ipa: "/o/" },
  { l: "U", t: 84.11, ipa: "/y/" },
  { l: "Y", t: 85.9, ipa: "/i/" },
];

export const FELICITATIONS_T = 155.91;
