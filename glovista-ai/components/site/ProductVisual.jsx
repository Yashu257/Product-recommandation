"use client";

// Asset-free, editorial product imagery: a soft neutral ground with a simple
// line-art vessel. Calm, clinical, premium — no photography required.
const GROUNDS = [
  { bg: "#EEF1EB", stroke: "#74856A", cap: "#5B6B53" }, // sage
  { bg: "#EBF1F3", stroke: "#66899A", cap: "#547181" }, // powder
  { bg: "#F4EEE3", stroke: "#B39A6C", cap: "#8a744f" }, // sand
  { bg: "#F0EFEA", stroke: "#78716C", cap: "#57534E" }, // stone
];

function pick(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return GROUNDS[h % GROUNDS.length];
}

// Different simple vessels by product category for a touch of variety.
function Vessel({ category = "", stroke, cap }) {
  const c = category.toLowerCase();
  if (c.includes("wash") || c.includes("cleanser") || c.includes("lotion") || c.includes("body")) {
    // Tall pump bottle
    return (
      <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <rect x="40" y="46" width="40" height="66" rx="9" />
        <path d="M52 46v-8h16v8" />
        <rect x="55" y="24" width="10" height="12" rx="3" fill={cap} stroke="none" />
        <path d="M65 30h9v6" stroke={cap} />
        <line x1="48" y1="70" x2="72" y2="70" strokeOpacity="0.5" strokeWidth="1.6" />
      </g>
    );
  }
  if (c.includes("kit")) {
    // Two vessels
    return (
      <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="30" y="52" width="26" height="58" rx="7" />
        <rect x="36" y="42" width="14" height="10" rx="3" fill={cap} stroke="none" />
        <rect x="64" y="60" width="30" height="50" rx="9" />
        <rect x="72" y="50" width="14" height="10" rx="3" fill={cap} stroke="none" />
      </g>
    );
  }
  if (c.includes("wellness") || c.includes("supplement")) {
    // Supplement jar
    return (
      <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="38" y="52" width="44" height="58" rx="10" />
        <rect x="40" y="40" width="40" height="14" rx="5" fill={cap} stroke="none" />
      </g>
    );
  }
  if (c.includes("soap") || c.includes("bar")) {
    return (
      <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="34" y="60" width="52" height="34" rx="10" />
        <rect x="42" y="52" width="36" height="12" rx="6" strokeOpacity="0.6" />
      </g>
    );
  }
  // Default: moisturizer jar
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round">
      <rect x="36" y="58" width="48" height="46" rx="12" />
      <rect x="40" y="44" width="40" height="16" rx="7" fill={cap} stroke="none" />
    </g>
  );
}

export default function ProductVisual({ id, category = "", className = "" }) {
  const g = pick(id);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: g.bg }}>
      <svg viewBox="0 0 120 132" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <ellipse cx="60" cy="116" rx="34" ry="5" fill="#000" opacity="0.05" />
        <Vessel category={category} stroke={g.stroke} cap={g.cap} />
      </svg>
    </div>
  );
}
