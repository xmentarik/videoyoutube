import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/outfit/900.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/playfair-display/800-italic.css";
import "@fontsource/cairo/500.css";
import "@fontsource/cairo/700.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";

// Each fontsource subset is a separate file behind a unicode-range, so request
// every subset we actually draw (accents, Arabic, IPA) before the first frame.
const FACES: [string, string][] = [
  ["400 40px Outfit", "Aa éèêàçôœ"],
  ["500 40px Outfit", "Aa éèêàçôœ"],
  ["600 40px Outfit", "Aa éèêàçôœ"],
  ["700 40px Outfit", "Aa éèêàçôœ"],
  ["800 40px Outfit", "Aa éèêàçôœ"],
  ["900 40px Outfit", "Aa éèêàçôœ"],
  ["italic 700 40px 'Playfair Display'", "Aa éèêàçôœ«»"],
  ["italic 800 40px 'Playfair Display'", "Aa éèêàçôœ«»"],
  ["500 40px Cairo", "مرحباً بكم"],
  ["700 40px Cairo", "مرحباً بكم"],
  ["400 40px 'Noto Sans'", "/aəɛʒʁɔ̃ɡʃ/"],
  ["500 40px 'Noto Sans'", "/aəɛʒʁɔ̃ɡʃ/"],
];

export const useFonts = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    Promise.all(FACES.map(([font, text]) => document.fonts.load(font, text)))
      .then(() => document.fonts.ready)
      .finally(() => continueRender(handle));
  }, [handle]);
};
