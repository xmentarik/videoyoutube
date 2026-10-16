import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import React, { createContext, useContext } from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const VOICE_SRC = staticFile("voiceover.wav");

type Voice = { level: number; bars: number[] };
const VoiceCtx = createContext<Voice>({ level: 0, bars: [] });

// Decodes the voiceover once and shares its per-frame loudness with every
// audio-reactive element (rings, equalizer bars).
export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(VOICE_SRC);
  let value: Voice = { level: 0, bars: new Array(12).fill(0) };
  if (audioData) {
    const spectrum = visualizeAudio({ fps, frame, audioData, numberOfSamples: 64, optimizeFor: "speed" });
    const bars = Array.from({ length: 12 }, (_, i) => Math.min(1, Math.sqrt(spectrum[i + 1]) * (1.6 + i * 0.25)));
    const level = Math.min(1, Math.sqrt(spectrum.slice(0, 16).reduce((a, b) => a + b, 0) / 16) * 2.4);
    value = { level, bars };
  }
  return <VoiceCtx.Provider value={value}>{children}</VoiceCtx.Provider>;
};

export const useVoice = () => useContext(VoiceCtx);
