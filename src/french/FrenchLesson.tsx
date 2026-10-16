import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, Captions, Hud, Wipe } from "./chrome";
import { useFonts } from "./fonts";
import { AlphabetGrid, AlphabetIntro } from "./scenes/Alphabet";
import { Intro } from "./scenes/Intro";
import { LetterH, Outro } from "./scenes/Outro";
import { Sounds } from "./scenes/Sounds";
import { EtU, Vowels } from "./scenes/Vowels";
import { C, F, FPS } from "./theme";
import { ALPHABET, BRAVO_T, FELICITATIONS_T, VOWELS } from "./timeline";
import { Confetti } from "./ui";
import { VOICE_SRC, VoiceProvider } from "./voice";

export type FrenchLessonProps = { showArabic: boolean };

type Sfx = { t: number; src: "pop" | "whoosh" | "chime"; v: number };

const SFX: Sfx[] = [
  // chapter / step transitions
  ...[14.6, 22.6, 70.95, 87.05, 106.55, 111.7, 122.55, 133.2, 142.75, 155.45].map((t) => ({ t, src: "whoosh" as const, v: 0.22 })),
  // topic cards, letters, vowels, examples, recap
  ...[7.76, 8.94, 10.62].map((t) => ({ t, src: "pop" as const, v: 0.18 })),
  ...ALPHABET.map((l) => ({ t: l.t - 0.05, src: "pop" as const, v: 0.1 })),
  ...VOWELS.map((v) => ({ t: v.t - 0.05, src: "pop" as const, v: 0.14 })),
  ...[117.85, 119.98, 121.36, 128.25, 130.52, 131.83, 137.95, 140.23, 141.48, 152.99, 154.07].map((t) => ({
    t,
    src: "pop" as const,
    v: 0.12,
  })),
  ...[157.6, 158.4, 159.2, 160.0].map((t) => ({ t, src: "pop" as const, v: 0.16 })),
  { t: 13.37, src: "chime", v: 0.18 },
  { t: BRAVO_T, src: "chime", v: 0.28 },
  { t: FELICITATIONS_T, src: "chime", v: 0.32 },
];

export const FrenchLesson: React.FC<FrenchLessonProps> = ({ showArabic }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <VoiceProvider>
      <AbsoluteFill style={{ fontFamily: F.display, color: C.ink }}>
        <Background t={t} />
        <Intro t={t} />
        <AlphabetIntro t={t} />
        <AlphabetGrid t={t} />
        <Vowels t={t} />
        <EtU t={t} />
        <Sounds t={t} />
        <LetterH t={t} />
        <Outro t={t} />
        <Hud t={t} />
        <Captions t={t} showArabic={showArabic} />
        <Confetti t={t} start={13.37} seed="parti" count={80} y={420} />
        <Confetti t={t} start={BRAVO_T} seed="bravo" x={430} y={420} />
        <Confetti t={t} start={FELICITATIONS_T} seed="felicitations" count={180} y={380} />
        <Wipe t={t} start={0} mode="reveal" />
        <Wipe t={t} start={168.3} mode="cover" />
        {t > 168.9 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 96, color: C.ink, opacity: Math.min(1, (t - 168.9) * 3) }}>
              Merci !
            </div>
          </AbsoluteFill>
        )}

        <Audio src={VOICE_SRC} />
        {SFX.map((s, i) => (
          <Sequence key={i} from={Math.max(0, Math.round(s.t * FPS))} durationInFrames={Math.round(1.6 * FPS)} layout="none">
            <Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.v} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </VoiceProvider>
  );
};
