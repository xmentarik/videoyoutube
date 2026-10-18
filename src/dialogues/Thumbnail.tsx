import React from "react";
import { AbsoluteFill } from "remotion";
import { useFonts } from "../french/fonts";
import { F } from "../french/theme";
import { Paul, Pose, Sophie } from "./Characters";
import { D } from "./Scenes";

// YouTube thumbnail (1280×720) for the 40 job-interview dialogues — same characters and palette as the video.

const happy = (look: number): Pose => ({ mouth: 0, blink: 0, look, tilt: 0, brow: 0.4, grin: true });

const Bubble: React.FC<{ text: string; color: string; style: React.CSSProperties; tail: "left" | "right" }> = ({ text, color, style, tail }) => (
  <div style={{ position: "absolute", ...style }}>
    <div style={{ padding: "14px 24px", borderRadius: 26, background: D.white, border: `5px solid ${color}`, fontFamily: F.display, fontWeight: 900, fontSize: 36, color: D.ink, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(29,36,51,0.18)" }}>
      {text}
    </div>
    <svg width={44} height={34} style={{ position: "absolute", top: "100%", marginTop: -5, [tail]: 40 }}>
      <path d="M4 0 L40 0 L22 30 Z" fill={D.white} stroke={color} strokeWidth={5} strokeLinejoin="round" />
      <rect x={2} y={0} width={40} height={6} fill={D.white} />
    </svg>
  </div>
);

export const DialoguesThumbnail: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${D.wall}, ${D.wallDark})`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 760, height: 760, right: -180, top: -160, borderRadius: "50%", background: `radial-gradient(circle, ${D.gold}55 0%, ${D.gold}00 65%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${D.ink}18 2px, transparent 2.5px)`, backgroundSize: "34px 34px", opacity: 0.6 }} />

      {/* right: Paul and Sophie at the desk */}
      <div style={{ position: "absolute", left: 600, top: 250, width: 330, height: 422 }}>
        <Paul p={happy(1)} />
      </div>
      <div style={{ position: "absolute", left: 920, top: 250, width: 330, height: 422 }}>
        <Sophie p={happy(-1)} />
      </div>
      <div style={{ position: "absolute", left: 560, right: -20, top: 600, bottom: -20, background: `linear-gradient(${D.wood}, ${D.woodDark})`, borderTop: "14px solid #C58E60" }} />
      <Bubble text="Vous avez le poste !" color={D.teal} tail="left" style={{ left: 600, top: 100 }} />
      <Bubble text="Merci beaucoup !" color={D.coral} tail="right" style={{ right: 40, top: 190 }} />

      {/* left: copy */}
      <div style={{ position: "absolute", left: 56, top: 48, padding: "10px 24px", borderRadius: 999, background: D.ink, color: D.white, fontFamily: F.display, fontWeight: 800, fontSize: 30, letterSpacing: 3 }}>
        FRANÇAIS · A1
      </div>
      <div style={{ position: "absolute", left: 48, top: 112, fontFamily: F.display, fontWeight: 900, color: D.ink, lineHeight: 0.86, letterSpacing: -3 }}>
        <div style={{ fontSize: 230, color: D.coral }}>40</div>
        <div style={{ fontSize: 92, letterSpacing: -1 }}>DIALOGUES</div>
      </div>
      <div style={{ position: "absolute", left: 54, top: 425, fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 64, lineHeight: 1.02, color: D.teal }}>
        L'entretien
        <br />
        d'embauche
      </div>
      <div style={{ position: "absolute", left: 56, bottom: 44, padding: "12px 26px", borderRadius: 18, background: D.gold, color: D.ink, fontFamily: F.display, fontWeight: 900, fontSize: 32, letterSpacing: 1, transform: "rotate(-2deg)", boxShadow: "0 10px 22px rgba(29,36,51,0.18)" }}>
        AUDIO + TEXTE
      </div>
    </AbsoluteFill>
  );
};
