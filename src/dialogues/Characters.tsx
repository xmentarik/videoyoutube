import React from "react";

// Flat SVG busts (viewBox 360×460, head centred at 180,150). Animated by the parent:
// mouth 0–1 (audio level while speaking), blink 0–1, look −1…1 (pupils/face turn), tilt in degrees.

export type Pose = { mouth: number; blink: number; look: number; tilt: number; brow: number; phone?: boolean; grin?: boolean };

const Eyes: React.FC<{ p: Pose; lashes?: boolean; ink: string }> = ({ p, lashes, ink }) => {
  const open = Math.max(0.08, 1 - p.blink);
  const dx = p.look * 5;
  return (
    <g>
      {[148, 212].map((x, i) => (
        <g key={x}>
          <ellipse cx={x + dx} cy={156} rx={9} ry={11 * open} fill={ink} />
          {open > 0.5 && <circle cx={x + dx + 3} cy={152} r={3} fill="#fff" />}
          {lashes && open > 0.3 && (
            <path d={i ? `M${x + dx + 6} 146 l7 -5` : `M${x + dx - 6} 146 l-7 -5`} stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
          )}
        </g>
      ))}
      {/* brows: inner ends slightly higher (friendly, not frowning) */}
      {[148, 212].map((x, i) => (
        <path
          key={x}
          d={`M${x - 16 + dx * 0.5} ${130 - p.brow * 7 + (i ? -3 : 2)} q16 ${-9 - p.brow * 2} 32 ${i ? 5 : -5}`}
          stroke={ink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

const Mouth: React.FC<{ p: Pose; lip: string; dx: number }> = ({ p, lip, dx }) => {
  const h = 3 + 22 * p.mouth;
  if (p.grin)
    return (
      <g>
        <path d={`M${156 + dx} 196 Q${180 + dx} 236 ${204 + dx} 196 Z`} fill="#5A1E1E" stroke={lip} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M${162 + dx} 198 L${198 + dx} 198 L${194 + dx} 206 L${166 + dx} 206 Z`} fill="#fff" />
      </g>
    );
  if (p.mouth < 0.06) return <path d={`M${162 + dx} 203 q18 12 36 0`} stroke={lip} strokeWidth={6} fill="none" strokeLinecap="round" />;
  return (
    <g>
      <ellipse cx={180 + dx} cy={205 + h * 0.3} rx={17 - p.mouth * 3} ry={h / 2 + 2} fill="#5A1E1E" stroke={lip} strokeWidth={4} />
      {p.mouth > 0.35 && <ellipse cx={180 + dx} cy={210 + h * 0.5} rx={9} ry={h / 5} fill="#E06B6B" />}
    </g>
  );
};

const Phone: React.FC<{ side: "left" | "right"; skin: string }> = ({ side, skin }) => {
  const x = side === "left" ? 66 : 254;
  return (
    <g transform={`rotate(${side === "left" ? -12 : 12} ${x + 20} 190)`}>
      <rect x={x} y={120} width={40} height={84} rx={9} fill="#1F2633" />
      <rect x={x + 5} y={128} width={30} height={64} rx={4} fill="#5FB3E8" />
      <ellipse cx={x + 20} cy={214} rx={26} ry={22} fill={skin} />
    </g>
  );
};

export const Paul: React.FC<{ p: Pose }> = ({ p }) => {
  const skin = "#E2AC84";
  const ink = "#2A1E18";
  const dx = p.look * 4;
  return (
    <svg viewBox="0 0 360 460" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`rotate(${p.tilt * 0.4} 180 420)`}>
        {/* torso: navy blazer, white shirt, teal tie, badge */}
        <path d="M40 460 C40 340 90 300 180 300 C270 300 320 340 320 460 Z" fill="#26334F" />
        <path d="M140 300 L180 380 L220 300 Z" fill="#F4F6F8" />
        <path d="M172 312 L188 312 L194 392 L180 410 L166 392 Z" fill="#127A7A" />
        <path d="M140 300 L180 380 L150 460 L118 330 Z" fill="#1C2740" />
        <path d="M220 300 L180 380 L210 460 L242 330 Z" fill="#1C2740" />
        <rect x={232} y={360} width={46} height={58} rx={6} fill="#fff" stroke="#127A7A" strokeWidth={4} />
        <rect x={240} y={370} width={30} height={8} rx={3} fill="#127A7A" />
        <rect x={240} y={386} width={22} height={5} rx={2} fill="#B9C2CC" />
      </g>
      <g transform={`rotate(${p.tilt} 180 290)`}>
        <rect x={152} y={232} width={56} height={78} rx={20} fill="#D49B74" />
        <ellipse cx={100} cy={160} rx={16} ry={22} fill={skin} />
        <ellipse cx={260} cy={160} rx={16} ry={22} fill={skin} />
        <ellipse cx={180} cy={150} rx={82} ry={96} fill={skin} />
        {/* short hair */}
        <path d="M98 140 C92 70 140 44 186 46 C238 48 270 78 262 140 C252 108 230 90 196 92 C160 94 120 96 98 140 Z" fill={ink} />
        <Eyes p={p} ink={ink} />
        {/* glasses */}
        <g fill="none" stroke="#3B4A63" strokeWidth={5}>
          <rect x={122 + dx} y={134} width={52} height={42} rx={14} />
          <rect x={186 + dx} y={134} width={52} height={42} rx={14} />
          <path d={`M174 ${150} q6 -6 12 0`} transform={`translate(${dx} 0)`} />
        </g>
        <path d={`M${180 + dx} 160 q-9 22 4 24`} stroke="#B97D58" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Mouth p={p} lip="#8E4A3A" dx={dx} />
        {p.phone && <Phone side="left" skin={skin} />}
      </g>
    </svg>
  );
};

export const Sophie: React.FC<{ p: Pose }> = ({ p }) => {
  const skin = "#C98D69";
  const ink = "#2B1A12";
  const hair = "#3B2316";
  const dx = p.look * 4;
  return (
    <svg viewBox="0 0 360 460" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* long hair behind */}
      <g transform={`rotate(${p.tilt} 180 290)`}>
        <path d="M86 150 C70 60 130 30 186 32 C252 34 296 80 282 170 C292 250 300 320 262 350 L98 350 C60 320 70 240 86 150 Z" fill={hair} />
      </g>
      <g transform={`rotate(${p.tilt * 0.4} 180 420)`}>
        {/* torso: coral jacket, cream top, necklace */}
        <path d="M44 460 C44 344 96 304 180 304 C264 304 316 344 316 460 Z" fill="#E4572E" />
        <path d="M134 304 C150 360 210 360 226 304 Z" fill="#F6E7D6" />
        <path d="M134 304 L170 400 L150 460 L112 336 Z" fill="#C9461F" />
        <path d="M226 304 L190 400 L210 460 L248 336 Z" fill="#C9461F" />
        <path d="M150 318 Q180 352 210 318" stroke="#F2B33D" strokeWidth={4} fill="none" />
        <circle cx={180} cy={340} r={7} fill="#F2B33D" />
      </g>
      <g transform={`rotate(${p.tilt} 180 290)`}>
        <rect x={154} y={232} width={52} height={80} rx={20} fill="#B97C59" />
        <ellipse cx={102} cy={162} rx={14} ry={20} fill={skin} />
        <ellipse cx={258} cy={162} rx={14} ry={20} fill={skin} />
        <circle cx={102} cy={190} r={7} fill="#F2B33D" />
        <circle cx={258} cy={190} r={7} fill="#F2B33D" />
        <ellipse cx={180} cy={152} rx={78} ry={94} fill={skin} />
        {/* side-parted fringe */}
        <path d="M100 150 C96 74 146 48 192 50 C246 52 272 92 262 150 C250 112 226 92 198 84 C178 112 140 128 100 150 Z" fill={hair} />
        <Eyes p={p} lashes ink={ink} />
        <ellipse cx={132} cy={190} rx={14} ry={8} fill="#E8826B" opacity={0.45} />
        <ellipse cx={228} cy={190} rx={14} ry={8} fill="#E8826B" opacity={0.45} />
        <path d={`M${180 + dx} 162 q-8 20 4 22`} stroke="#A86E4E" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Mouth p={p} lip="#B5524B" dx={dx} />
        {p.phone && <Phone side="right" skin={skin} />}
      </g>
    </svg>
  );
};
