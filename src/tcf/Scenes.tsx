import React from "react";
import { AbsoluteFill } from "remotion";
import { Item, LETTERS, SCRIPT } from "./data";
import { CheckMark, Chip, F, K, MapleLeaf, SH, pop, prog, rise, spr } from "./ui";

// Cue at a fraction of a segment's audio (used where the script gives no finer timing).
const at = (it: Item, frac: number) => it.audioStart + it.dur * frac;

const Shell: React.FC<{ t: number; it: Item; children: React.ReactNode }> = ({ t, it, children }) => {
  if (t < it.start || t > it.end) return null;
  const pin = prog(t, it.start, 0.45);
  const pout = prog(t, it.end - 0.35, 0.35);
  return <AbsoluteFill style={{ opacity: pin * (1 - pout), transform: `translateY(${(1 - pin) * 30 - pout * 24}px)` }}>{children}</AbsoluteFill>;
};

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 36, background: K.white, boxShadow: SH, padding: "34px 40px", ...style }}>{children}</div>
);

/* ---------------- intro ---------------- */

export const Intro1: React.FC<{ t: number; it: Item }> = ({ t, it }) => (
  <Shell t={t} it={it}>
    <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...pop(t, it.start + 0.2, 0.3, 0), transform: `${pop(t, it.start + 0.2, 0.3, 0).transform} rotate(${(1 - spr(t, it.start + 0.2)) * -40}deg)` }}>
        <MapleLeaf size={150} />
      </div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 120, color: K.ink, marginTop: 10, ...rise(t, it.audioStart) }}>
        Bonjour et bienvenue !
      </div>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 150, lineHeight: 1, color: K.ink, letterSpacing: -2, ...pop(t, at(it, 0.32)) }}>
        TCF <span style={{ color: K.red }}>CANADA</span> 2026
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
        <div style={pop(t, at(it, 0.62))}>
          <Chip bg={K.ink} size={32}>COMPRÉHENSION ORALE</Chip>
        </div>
        <div style={pop(t, at(it, 0.82))}>
          <Chip bg={K.red} size={32}>NIVEAU A1 · DÉBUTANT</Chip>
        </div>
      </div>
    </div>
  </Shell>
);

export const Intro2: React.FC<{ t: number; it: Item }> = ({ t, it }) => {
  const facts = [
    { big: "TCF", small: "un test de français pour immigrer au Canada", f: 0.0 },
    { big: "39", small: "questions dans l'épreuve de compréhension orale", f: 0.38 },
    { big: "×1", small: "vous écoutez le document une seule fois", f: 0.62 },
    { big: "A B C D", small: "vous choisissez une réponse", f: 0.82 },
  ];
  return (
    <Shell t={t} it={it}>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontFamily: F.display, fontWeight: 900, fontSize: 80, color: K.ink, ...rise(t, it.start + 0.1) }}>
        Le TCF Canada, <span style={{ fontFamily: F.serif, fontStyle: "italic", color: K.red }}>c'est quoi ?</span>
      </div>
      <div style={{ position: "absolute", top: 340, left: 140, right: 140, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {facts.map((x) => (
          <Card key={x.big} style={{ display: "flex", alignItems: "center", gap: 30, ...pop(t, at(it, x.f)) }}>
            <div style={{ minWidth: 200, fontFamily: F.display, fontWeight: 900, fontSize: x.big.length > 4 ? 60 : 92, color: K.red, textAlign: "center" }}>{x.big}</div>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, color: K.ink, lineHeight: 1.2 }}>{x.small}</div>
          </Card>
        ))}
      </div>
    </Shell>
  );
};

export const Intro3: React.FC<{ t: number; it: Item }> = ({ t, it }) => {
  const steps = [
    { n: "1", s: "Écoutez", f: 0.36 },
    { n: "2", s: "Lisez la question", f: 0.42 },
    { n: "3", s: "Choisissez", f: 0.48 },
    { n: "4", s: "Vérifiez la réponse", f: 0.56 },
  ];
  return (
    <Shell t={t} it={it}>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        <div style={pop(t, at(it, 0.0))}>
          <Chip bg={K.ink} size={30}>200 QUESTIONS AVEC RÉPONSES</Chip>
        </div>
        <div style={pop(t, at(it, 0.14))}>
          <Chip bg={K.red} size={30}>PARTIE 1 · Q1 → Q40</Chip>
        </div>
      </div>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 96, color: K.ink, ...rise(t, at(it, 0.3)) }}>
        La méthode
      </div>
      <div style={{ position: "absolute", top: 420, left: 120, right: 120, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {steps.map((x, i) => (
          <React.Fragment key={x.n}>
            {i > 0 && <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 60, color: K.muted, opacity: prog(t, at(it, x.f), 0.3) }}>→</div>}
            <Card style={{ width: 330, textAlign: "center", padding: "30px 20px", ...pop(t, at(it, x.f)) }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  margin: "0 auto",
                  borderRadius: 42,
                  background: i === 3 ? K.green : K.red,
                  color: K.white,
                  fontFamily: F.display,
                  fontWeight: 900,
                  fontSize: 46,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {x.n}
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 38, color: K.ink, marginTop: 16 }}>{x.s}</div>
            </Card>
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 44, color: K.inkSoft, ...rise(t, at(it, 0.68)) }}>
          Prenez un papier et un stylo, et <b style={{ color: K.ink }}>comptez vos points</b>.
        </div>
        <div style={pop(t, at(it, 0.9))}>
          <Chip bg={K.red} size={44}>On commence !</Chip>
        </div>
      </div>
    </Shell>
  );
};

/* ---------------- section card ---------------- */

export const SectionCard: React.FC<{ t: number; it: Item }> = ({ t, it }) => {
  const s = SCRIPT.sections[String(it.section)];
  const bravo = it.text.startsWith("Bravo");
  const titleT = bravo ? at(it, 0.35) : it.audioStart;
  return (
    <Shell t={t} it={it}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 80,
            background: K.red,
            color: K.white,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 26px 0 ${K.redDeep}, ${SH}`,
            transform: `rotate(${-6 + (1 - spr(t, titleT)) * -30}deg) scale(${0.4 + 0.6 * spr(t, titleT, { damping: 10 })})`,
          }}
        >
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 40, letterSpacing: 6 }}>SECTION</div>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 210, lineHeight: 1 }}>{it.section}</div>
        </div>
        <div style={{ maxWidth: 900 }}>
          {bravo && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, ...pop(t, it.audioStart) }}>
              <CheckMark size={56} p={prog(t, it.audioStart, 0.6)} />
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 38, color: K.green }}>Section {Number(it.section) - 1} terminée !</span>
            </div>
          )}
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: K.ink, ...rise(t, titleT + 0.3) }}>{s.title}</div>
          <div style={{ display: "flex", gap: 18, marginTop: 30, ...rise(t, titleT + 0.6) }}>
            <Chip bg={K.ink} size={30}>
              QUESTIONS {s.from} → {s.to}
            </Chip>
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, color: K.inkSoft, marginTop: 28, ...rise(t, at(it, bravo ? 0.75 : 0.55)) }}>
            {it.text.split(/(?<=[.!])\s/).slice(-1)[0]}
          </div>
        </div>
      </div>
    </Shell>
  );
};

/* ---------------- mi-parcours ---------------- */

export const Halfway: React.FC<{ t: number; it: Item }> = ({ t, it }) => (
  <Shell t={t} it={it}>
    <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 130, color: K.ink, ...pop(t, it.audioStart) }}>Super !</div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 56, color: K.red, ...rise(t, at(it, 0.08)) }}>Vous êtes à la moitié</div>
      <div style={{ width: 1100, height: 28, borderRadius: 14, background: `${K.ink}14`, marginTop: 40, overflow: "hidden", ...rise(t, at(it, 0.1)) }}>
        <div style={{ width: `${50 * prog(t, at(it, 0.1), 1.2)}%`, height: "100%", background: K.red, borderRadius: 14 }} />
      </div>
      <Card style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 40, ...pop(t, at(it, 0.25)) }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 120, color: K.ink }}>
          ?<span style={{ color: K.muted }}> / 20</span>
        </div>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, color: K.inkSoft, maxWidth: 560 }}>Combien de bonnes réponses ?</div>
      </Card>
      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, color: K.inkSoft, marginTop: 50, ...rise(t, at(it, 0.55)) }}>
        Difficile ? Ce n'est pas grave : réécoutez la vidéo.
      </div>
    </div>
  </Shell>
);

/* ---------------- conclusion ---------------- */

export const Outro1: React.FC<{ t: number; it: Item }> = ({ t, it }) => (
  <Shell t={t} it={it}>
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 120, color: K.ink, ...pop(t, it.audioStart) }}>Félicitations !</div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 46, color: K.red, ...rise(t, at(it, 0.12)) }}>Vous avez fini les 40 questions</div>
    </div>
    <div style={{ position: "absolute", top: 390, left: 140, right: 140, display: "flex", gap: 40 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
        <Card style={{ borderLeft: `14px solid ${K.green}`, ...pop(t, at(it, 0.38)) }}>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 64, color: K.green }}>30 ou plus</div>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, color: K.ink }}>Bravo, votre niveau A1 est très bon !</div>
        </Card>
        <Card style={{ borderLeft: `14px solid ${K.gold}`, ...pop(t, at(it, 0.66)) }}>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 64, color: "#C98A0B" }}>Moins de 30</div>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, color: K.ink }}>Pas de problème : réécoutez et essayez encore.</div>
        </Card>
      </div>
      <Card style={{ width: 640, padding: "26px 30px", ...pop(t, at(it, 0.25)) }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26, color: K.inkSoft, letterSpacing: 2, marginBottom: 12 }}>CORRIGÉ</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {SCRIPT.questions.map((q, i) => (
            <div
              key={q.n}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 12px",
                borderRadius: 12,
                background: K.paper,
                fontFamily: F.display,
                fontSize: 24,
                opacity: prog(t, at(it, 0.25) + i * 0.03, 0.2),
              }}
            >
              <span style={{ color: K.inkSoft, fontWeight: 600 }}>{q.n}</span>
              <span style={{ color: [K.red, K.blue, K.green, K.ink][LETTERS.indexOf(q.answer)], fontWeight: 900 }}>{q.answer}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </Shell>
);

export const Outro2: React.FC<{ t: number; it: Item }> = ({ t, it }) => (
  <Shell t={t} it={it}>
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 26, ...pop(t, it.audioStart) }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 70, color: K.red }}>? / 40</div>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 42, color: K.ink }}>Écrivez votre score dans les commentaires !</div>
      </Card>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          alignItems: "center",
          gap: 34,
          padding: "30px 46px",
          borderRadius: 40,
          background: K.red,
          color: K.white,
          boxShadow: `0 18px 0 ${K.redDeep}`,
          ...pop(t, at(it, 0.3)),
        }}
      >
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 52 }}>Abonnez-vous</div>
        <div style={{ width: 4, height: 70, background: "rgba(255,255,255,0.5)" }} />
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 30, opacity: 0.85, letterSpacing: 2 }}>PROCHAINE VIDÉO</div>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 44 }}>Partie 2 · Q41 → Q80</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 70, ...rise(t, at(it, 0.7)) }}>
        <MapleLeaf size={80} />
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 800, fontSize: 84, color: K.ink }}>Bon courage pour le TCF Canada !</div>
      </div>
    </div>
  </Shell>
);
