import React from "react";
import { AbsoluteFill } from "remotion";
import { F, prog, spr } from "../french/theme";
import { Pose, Paul, Sophie } from "./Characters";
import { Place, SCRIPT, Section, Who } from "./data";

export const D = {
  paper: "#F7F1E8",
  wall: "#F1E4D3",
  wallDark: "#E6D3BC",
  ink: "#1D2433",
  inkSoft: "#5B6475",
  teal: "#127A7A",
  tealSoft: "#DDF0EE",
  coral: "#E4572E",
  coralSoft: "#FCE3DA",
  gold: "#F2B33D",
  wood: "#B07A4F",
  woodDark: "#8C5C38",
  white: "#FFFFFF",
};
export const SPEAKER = {
  Paul: { color: D.teal, soft: D.tealSoft, role: "l'employé" },
  Sophie: { color: D.coral, soft: D.coralSoft, role: "la candidate" },
};
const SH = "0 22px 50px rgba(29,36,51,0.16), 0 3px 8px rgba(29,36,51,0.08)";

export const rise = (t: number, start: number, dy = 30, dur = 0.5): React.CSSProperties => {
  const p = prog(t, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
};
export const pop = (t: number, start: number): React.CSSProperties => {
  const s = spr(t, start);
  return { opacity: Math.min(1, s * 1.6), transform: `scale(${0.6 + 0.4 * s})` };
};

/* ---------------- backgrounds ---------------- */

const Window: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, border: `14px solid ${D.white}`, overflow: "hidden", boxShadow: SH }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#9FD3F0, #D9F0FA)" }} />
    {/* skyline */}
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "62%" }}>
      <path d="M0 200 L0 120 Q80 60 160 110 L160 200 Z" fill="#8DBF8A" />
      <g fill="#7C93AD">
        <rect x={150} y={70} width={40} height={130} />
        <rect x={196} y={40} width={34} height={160} />
        <rect x={236} y={90} width={46} height={110} />
        <rect x={288} y={56} width={30} height={144} />
        <rect x={324} y={100} width={76} height={100} />
      </g>
      <g fill="#C6D6E6">
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <rect key={r} x={204} y={52 + r * 22} width={18} height={8} />
        ))}
      </g>
    </svg>
    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 12, marginLeft: -6, background: D.white }} />
  </div>
);

const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg viewBox="0 0 160 260" style={{ position: "absolute", left: x, top: y, width: 160 * s, height: 260 * s }}>
    <path d="M80 170 C40 120 20 70 40 30 C60 70 76 110 80 170 Z" fill="#3E8E5E" />
    <path d="M80 170 C120 120 140 70 124 24 C100 70 86 110 80 170 Z" fill="#4FA56E" />
    <path d="M80 170 C60 110 70 60 82 10 C96 60 98 110 80 170 Z" fill="#5CB97C" />
    <path d="M44 166 L116 166 L106 256 L54 256 Z" fill="#D7774B" />
  </svg>
);

const Logo: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, padding: "18px 30px", borderRadius: 16, background: D.ink, boxShadow: SH }}>
    <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 40, color: D.white, letterSpacing: 4 }}>
      MODE <span style={{ color: D.gold }}>PLUS</span>
    </div>
  </div>
);

const Office: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(${D.wall}, ${D.wallDark})` }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 10, background: "#D6BFA3" }} />
    <Window x={720} y={150} w={480} h={380} />
    <Logo x={130} y={180} />
    <Plant x={1660} y={430} s={1.1} />
    <svg viewBox="0 0 100 100" style={{ position: "absolute", left: 1480, top: 170, width: 110, height: 110 }}>
      <circle cx={50} cy={50} r={46} fill={D.white} stroke={D.ink} strokeWidth={6} />
      <path d="M50 50 L50 24 M50 50 L68 58" stroke={D.ink} strokeWidth={6} strokeLinecap="round" />
    </svg>
  </AbsoluteFill>
);

const Desk: React.FC<{ papers?: boolean }> = ({ papers = true }) => (
  <>
    <div style={{ position: "absolute", left: -20, right: -20, top: 820, bottom: 0, background: `linear-gradient(${D.wood}, ${D.woodDark})`, boxShadow: "0 -10px 30px rgba(0,0,0,0.12)" }} />
    <div style={{ position: "absolute", left: -20, right: -20, top: 820, height: 22, background: "#C58E60" }} />
    {papers && (
      <>
        <div style={{ position: "absolute", left: 860, top: 728, width: 200, height: 112, borderRadius: "12px 12px 0 0", background: "#2E3646", border: `10px solid #4A5468`, borderBottom: "none" }} />
        <div style={{ position: "absolute", left: 830, top: 832, width: 260, height: 18, borderRadius: 6, background: "#4A5468" }} />
        <div style={{ position: "absolute", left: 1130, top: 836, width: 150, height: 40, background: D.white, transform: "rotate(-4deg)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }} />
        <div style={{ position: "absolute", left: 650, top: 838, width: 140, height: 36, background: "#FFF6D8", transform: "rotate(5deg)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }} />
      </>
    )}
  </>
);

const Home: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#E7EEF6, #D3DFEC)" }}>
    <Window x={520} y={160} w={300} h={300} />
    <div style={{ position: "absolute", left: 90, top: 200, width: 120, height: 150, borderRadius: 10, background: D.gold, opacity: 0.85, boxShadow: SH }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#9AA9C2" }} />
  </AbsoluteFill>
);

const Store: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(#F5EDE4, #EADCCB)` }}>
    <Logo x={790} y={110} />
    {[150, 1370].map((x, r) => (
      <div key={x} style={{ position: "absolute", left: x, top: 330, width: 420, height: 300 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, borderRadius: 5, background: "#8A8F99" }} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 20 + i * 66,
              top: 14,
              width: 54,
              height: 190 + ((i + r) % 3) * 30,
              borderRadius: "16px 16px 8px 8px",
              background: ["#E4572E", "#127A7A", "#F2B33D", "#1D2433", "#7FA7D9", "#C9461F"][(i + r * 2) % 6],
            }}
          />
        ))}
      </div>
    ))}
  </AbsoluteFill>
);

/* ---------------- characters on set ---------------- */

type Cast = { paul: Pose; sophie: Pose };

const Bust: React.FC<{ who: Who; pose: Pose; x: number; y: number; w: number; active: boolean }> = ({ who, pose, x, y, w, active }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: (w * 460) / 360, transform: `scale(${active ? 1.02 : 1})`, transformOrigin: "50% 100%" }}>
    {who === "Paul" ? <Paul p={pose} /> : <Sophie p={pose} />}
  </div>
);

const NameTag: React.FC<{ who: Who; x: number; y: number; active: boolean }> = ({ who, x, y, active }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translateX(-50%)",
      padding: "10px 26px",
      borderRadius: 999,
      background: active ? SPEAKER[who].color : D.white,
      color: active ? D.white : SPEAKER[who].color,
      fontFamily: F.display,
      fontWeight: 800,
      fontSize: 30,
      letterSpacing: 1,
      boxShadow: SH,
      whiteSpace: "nowrap",
    }}
  >
    {who} <span style={{ fontWeight: 600, opacity: 0.8 }}>· {SPEAKER[who].role}</span>
  </div>
);

export const Stage: React.FC<{ place: Place; cast: Cast; speaking: Who | null }> = ({ place, cast, speaking }) => {
  if (place === "telephone") {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
          <Office />
          <Bust who="Paul" pose={{ ...cast.paul, phone: true }} x={250} y={330} w={480} active={speaking === "Paul"} />
          <Desk papers={false} />
          <NameTag who="Paul" x={480} y={900} active={speaking === "Paul"} />
        </div>
        <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
          <Home />
          <Bust who="Sophie" pose={{ ...cast.sophie, phone: true }} x={230} y={330} w={480} active={speaking === "Sophie"} />
          <NameTag who="Sophie" x={480} y={900} active={speaking === "Sophie"} />
        </div>
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, height: 1080, background: D.ink }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {place === "magasin" ? <Store /> : <Office />}
      <Bust who="Paul" pose={cast.paul} x={260} y={323} w={500} active={speaking === "Paul"} />
      <Bust who="Sophie" pose={cast.sophie} x={1160} y={323} w={500} active={speaking === "Sophie"} />
      {place === "magasin" ? (
        <div style={{ position: "absolute", left: -20, right: -20, top: 840, bottom: 0, background: "linear-gradient(#3B4358, #2A3142)" }} />
      ) : (
        <Desk />
      )}
      <NameTag who="Paul" x={510} y={920} active={speaking === "Paul"} />
      <NameTag who="Sophie" x={1410} y={920} active={speaking === "Sophie"} />
    </AbsoluteFill>
  );
};

/* ---------------- speech bubble ---------------- */

export const Bubble: React.FC<{ t: number; who: Who; text: string; start: number; split: boolean }> = ({ t, who, text, start, split }) => {
  const left = who === "Paul";
  const s = spr(t, start, { damping: 15, stiffness: 220 });
  const tailX = split ? (left ? 490 : 1430) : left ? 510 : 1410; // above each head
  const box: React.CSSProperties = split
    ? { left: left ? 70 : 1030, width: 820 }
    : { left: left ? 110 : 760, width: 1050 };
  const size = text.length > 70 ? 44 : 52;
  return (
    <div style={{ position: "absolute", top: 92, ...box, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 24}px) scale(${0.9 + 0.1 * s})`, transformOrigin: left ? "20% 100%" : "80% 100%" }}>
      <div style={{ position: "relative", padding: "30px 40px 34px", borderRadius: 40, background: D.white, border: `6px solid ${SPEAKER[who].color}`, boxShadow: SH }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: SPEAKER[who].color, marginBottom: 8 }}>{who.toUpperCase()}</div>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: size, lineHeight: 1.18, color: D.ink }}>{text}</div>
      </div>
      <svg width={70} height={56} style={{ position: "absolute", left: tailX - (box.left as number) - 35, top: "100%", marginTop: -6 }}>
        <path d="M6 0 L64 0 L35 52 Z" fill={D.white} stroke={SPEAKER[who].color} strokeWidth={6} strokeLinejoin="round" />
        <rect x={4} y={0} width={62} height={7} fill={D.white} />
      </svg>
    </div>
  );
};

/* ---------------- cards ---------------- */

export const DialogueTitle: React.FC<{ t: number; start: number; end: number; n: number; title: string }> = ({ t, start, end, n, title }) => {
  const out = prog(t, end - 0.35, 0.35);
  return (
    <AbsoluteFill style={{ background: `rgba(29,36,51,${0.45 * (1 - out) * prog(t, start, 0.3)})`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...pop(t, start + 0.05), opacity: (1 - out) * Math.min(1, spr(t, start + 0.05) * 1.6), display: "flex", alignItems: "center", gap: 34, padding: "34px 54px", borderRadius: 44, background: D.white, boxShadow: SH }}>
        <div style={{ width: 150, height: 150, borderRadius: 36, background: D.coral, color: D.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 900 }}>
          <div style={{ fontSize: 22, letterSpacing: 3 }}>DIALOGUE</div>
          <div style={{ fontSize: 84, lineHeight: 1 }}>{String(n).padStart(2, "0")}</div>
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 92, color: D.ink }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const CardShell: React.FC<{ t: number; start: number; end: number; bg: string; children: React.ReactNode }> = ({ t, start, end, bg, children }) => {
  const pin = prog(t, start, 0.5);
  const pout = prog(t, end - 0.4, 0.4);
  return (
    <AbsoluteFill style={{ background: bg, clipPath: `circle(${pin * 150 * (1 - pout)}% at 50% 50%)` }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - pout }}>{children}</div>
    </AbsoluteFill>
  );
};

export const SectionCard: React.FC<{ t: number; start: number; end: number; section: Section }> = ({ t, start, end, section }) => (
  <CardShell t={t} start={start} end={end} bg={D.ink}>
    <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ ...rise(t, start + 0.3), fontFamily: F.display, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: D.gold }}>
        SECTION {section.n} · DIALOGUES {section.from} → {section.to}
      </div>
      <div style={{ ...rise(t, start + 0.45), fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 116, color: D.white, textAlign: "center", lineHeight: 1.05, maxWidth: 1500 }}>
        {section.title}
      </div>
      <div style={{ ...rise(t, start + 0.8), fontFamily: F.display, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#9AA3B5", marginTop: 30 }}>MOTS IMPORTANTS</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: 1500 }}>
        {section.vocab.map((w, i) => (
          <div key={w} style={{ ...pop(t, start + 0.95 + i * 0.12), padding: "14px 30px", borderRadius: 999, background: i % 2 ? D.teal : D.coral, color: D.white, fontFamily: F.display, fontWeight: 800, fontSize: 38 }}>
            {w}
          </div>
        ))}
      </div>
    </div>
  </CardShell>
);

export const Intro: React.FC<{ t: number; start: number; end: number }> = ({ t, start, end }) => {
  const out = prog(t, end - 0.5, 0.5);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ ...pop(t, start + 0.3), display: "flex", gap: 16 }}>
          <div style={{ padding: "12px 28px", borderRadius: 999, background: D.ink, color: D.white, fontFamily: F.display, fontWeight: 800, fontSize: 32, letterSpacing: 3 }}>FRANÇAIS · NIVEAU A1</div>
        </div>
        <div style={{ ...rise(t, start + 0.6), padding: "26px 60px", borderRadius: 40, background: D.white, boxShadow: SH, textAlign: "center" }}>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 110, lineHeight: 1, color: D.ink }}>
            <span style={{ color: D.coral }}>40</span> dialogues
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 70, color: D.teal }}>L'entretien d'embauche</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC<{ t: number; start: number }> = ({ t, start }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...rise(t, start + 0.3), padding: "26px 60px", borderRadius: 40, background: D.white, boxShadow: SH, textAlign: "center" }}>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 100, color: D.ink, lineHeight: 1.05 }}>Bravo !</div>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 44, color: D.teal }}>
          Vous avez écouté les {SCRIPT.dialogues.length} dialogues.
        </div>
      </div>
      <div style={{ ...pop(t, start + 1.2), display: "flex", alignItems: "center", gap: 24, padding: "22px 40px", borderRadius: 32, background: D.coral, color: D.white, boxShadow: `0 14px 0 #B8401E` }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 46 }}>Abonnez-vous</div>
        <div style={{ width: 4, height: 54, background: "rgba(255,255,255,0.5)" }} />
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 34 }}>Réécoutez et répétez les dialogues !</div>
      </div>
    </div>
  </AbsoluteFill>
);
