import { PRODUCTS } from "@/data/products";

// ---------------------------------------------------------------------------
// GlowAI recommendation engine
// Maps an assessment answer object -> a full, structured skin report.
// Deterministic, rule-based, and explainable.
// ---------------------------------------------------------------------------

const LABELS = {
  skinType: {
    oily: "Oily",
    dry: "Dry",
    combination: "Combination",
    normal: "Normal",
    sensitive: "Sensitive",
  },
  concerns: {
    acne: "Acne",
    pimples: "Pimples",
    darkSpots: "Dark Spots",
    pigmentation: "Pigmentation",
    dryness: "Dryness",
    dullness: "Dullness",
    sensitive: "Sensitive Skin",
    stretchMarks: "Stretch Marks",
    hairFall: "Hair Fall",
    gutHealth: "Gut Health",
    heartHealth: "Heart Health",
    boneHealth: "Bone Health",
    lowEnergy: "Low Energy",
  },
};

export function label(group, key) {
  return LABELS[group]?.[key] ?? key;
}

// Push a product id once, keeping insertion order and de-duping.
function addUnique(list, id, why) {
  if (id && !list.some((x) => x.id === id)) list.push({ id, why });
}

export function buildRecommendation(answers) {
  const {
    skinType = "normal",
    gender,
    concerns = [],
    severity = "moderate",
    duration = "1to3m",
    routine = "never",
    allergies = "no",
    budget,
  } = answers;

  const has = (c) => concerns.includes(c);
  const picks = []; // ordered { id, why }
  const reasons = []; // { title, detail }

  // --- Core skin-type baseline ------------------------------------------------
  if (skinType === "dry") {
    addUnique(picks, "freshAura", "A hydrating cleanser that won't strip your already-dry skin.");
    addUnique(picks, "ceraRestore", "Ceramide-rich cream chosen to rebuild your moisture barrier.");
    addUnique(picks, "skinBarrierKit", "A full regimen to fortify a dry, depleted barrier.");
    reasons.push({
      title: "Barrier-first for dry skin",
      detail:
        "Ceramides + hyaluronic acid rebuild the moisture barrier so skin holds hydration instead of losing it.",
    });
  } else if (skinType === "oily" || skinType === "combination") {
    addUnique(picks, "freshBloom", "Gel cleanser matched to your oil-prone skin to clear pores without over-drying.");
    addUnique(picks, "simplyMatte", "Oil-free hydration that keeps you matte for hours.");
    reasons.push({
      title: "Balance without stripping",
      detail:
        "Salicylic acid clears pores while niacinamide + zinc regulate oil — hydration stays intact, shine doesn't.",
    });
  } else if (skinType === "sensitive") {
    addUnique(picks, "freshAura", "A gentle, fragrance-conscious cleanser for reactive skin.");
    addUnique(picks, "ceraRestore", "Soothing, madecassoside-rich cream to calm sensitivity.");
    reasons.push({
      title: "Gentle & soothing",
      detail:
        "Fragrance-conscious, madecassoside-rich formulas calm reactivity and reduce redness over time.",
    });
  } else {
    addUnique(picks, "freshAura", "A balanced daily cleanser to keep normal skin healthy.");
    addUnique(picks, "simplyMatte", "Lightweight hydration for an everyday glow.");
    reasons.push({
      title: "Maintain a healthy glow",
      detail: "A balanced cleanse-and-hydrate duo keeps normal skin resilient and radiant.",
    });
  }

  // --- Concern-driven rules ---------------------------------------------------
  if ((skinType === "oily" || skinType === "combination") && (has("acne") || has("pimples"))) {
    addUnique(picks, "auraMatteKit", "Selected specifically to treat your active acne and prevent new breakouts.");
    reasons.push({
      title: "Targeted acne control",
      detail:
        "The AuraMatte Kit layers salicylic acid with benzoyl peroxide to treat active breakouts and prevent new ones.",
    });
  }

  if ((skinType === "oily" || skinType === "combination") && has("darkSpots")) {
    addUnique(picks, "koziGleam", "Kojic-acid bar picked to fade your post-acne dark spots.");
    reasons.push({
      title: "Fade spots on oily skin",
      detail: "Kojic acid + vitamin C break down excess melanin to visibly lighten post-acne marks.",
    });
  }

  if (has("pigmentation") || has("dullness") || has("darkSpots")) {
    addUnique(picks, "koziGleam", "Brightening actives to even out pigmentation and restore glow.");
    reasons.push({
      title: "Brighten & even tone",
      detail: "Vitamin C and kojic acid interrupt pigment formation, restoring clarity and glow.",
    });
  }

  if (has("dryness")) {
    addUnique(picks, "freshAura", "Chosen to cleanse without adding to your dryness.");
    addUnique(picks, "ceraRestore", "Deep, lasting hydration for dry patches.");
    addUnique(picks, "skinBarrierKit", "A complete plan to resolve persistent dryness.");
  }

  if (has("sensitive") || skinType === "sensitive") {
    addUnique(picks, "skinBarrierKit", "Barrier-repair regimen to reduce reactivity and redness.");
  }

  if (gender === "male" && (skinType === "oily" || skinType === "combination")) {
    addUnique(picks, "coreManKit", "An all-in-one routine tuned for oily male skin.");
    reasons.push({
      title: "Built for men's skin",
      detail: "The Core Man Kit tackles oil, shave irritation and dullness in one simple 3-step routine.",
    });
  }

  if (has("stretchMarks")) {
    addUnique(picks, "velvetGlowKit", "Collagen + centella to soften the look of stretch marks.");
    reasons.push({
      title: "Smooth stretch marks",
      detail: "Centella + collagen peptides improve elasticity and soften the appearance of marks.",
    });
  }

  // --- Wellness / inner-health rules -----------------------------------------
  if (has("hairFall")) {
    addUnique(picks, "hairDase", "A supplement to strengthen roots and reduce shedding.");
    reasons.push({ title: "Strengthen from the root", detail: "Biotin + saw palmetto support thicker growth and reduce shedding." });
  }
  if (has("gutHealth")) {
    addUnique(picks, "gutSync", "Probiotics to balance the gut-skin axis behind flare-ups.");
    reasons.push({ title: "Gut-skin axis", detail: "A balanced microbiome calms inflammation that shows up on your skin." });
  }
  if (has("boneHealth")) {
    addUnique(picks, "calblend", "Calcium with D3 + K2 for long-term bone density.");
    reasons.push({ title: "Bone support", detail: "Calcium with D3 + K2 is optimized for absorption and long-term density." });
  }
  if (has("heartHealth")) {
    addUnique(picks, "omegaPot", "Omega-3s for heart health and a calmer skin barrier.");
    reasons.push({ title: "Heart & skin lipids", detail: "Omega-3s support cardiovascular health and a resilient skin barrier." });
  }
  if (has("lowEnergy")) {
    addUnique(picks, "spiroRich", "Spirulina greens to fight fatigue and support skin.");
    reasons.push({ title: "Restore your energy", detail: "Spirulina delivers plant iron, protein and B12 to fight fatigue." });
  }

  // Everyday finishers
  addUnique(picks, "lipRevive", "A daily lip treatment to round out your routine.");
  if (skinType !== "oily") addUnique(picks, "dewyTouch", "Body hydration to match your facial care.");

  // --- Budget filtering -------------------------------------------------------
  // Show only products that fit within the selected monthly spend. The upper
  // bound of the chosen band is the per-product price ceiling.
  const priceCeil = budget === "300to500" ? 500 : budget === "500to1000" ? 1000 : Infinity;
  const budgetCap = budget === "300to500" ? 3 : budget === "500to1000" ? 5 : 7;

  const priced = picks
    .map(({ id, why }) => (PRODUCTS[id] ? { ...PRODUCTS[id], why } : null))
    .filter(Boolean);

  let within = priced.filter((p) => p.price <= priceCeil);
  // Never show an empty result: if nothing fits, offer the most affordable picks.
  if (within.length === 0) within = [...priced].sort((a, b) => a.price - b.price).slice(0, 2);
  const products = within.slice(0, budgetCap);

  // --- Concern split ----------------------------------------------------------
  const concernLabels = concerns.map((c) => label("concerns", c));
  const primaryConcerns = concernLabels.slice(0, 2);
  const secondaryConcerns = concernLabels.slice(2);

  // --- Scores (0–100) ---------------------------------------------------------
  const scores = buildScores({ skinType, concerns, severity, duration, routine });

  // --- Recommended ingredients ------------------------------------------------
  const ingredients = buildIngredients(products);

  // --- Lifestyle tips ---------------------------------------------------------
  const lifestyle = buildLifestyle({ skinType, concerns });

  // --- Timeline ---------------------------------------------------------------
  const timeline = buildTimeline(severity);

  // --- Confidence -------------------------------------------------------------
  const confidence = scoreConfidence({ concerns, severity, routine, products, allergies });

  return {
    aiName: "GlowAI",
    skinType: label("skinType", skinType) || "Balanced",
    skinTypeKey: skinType,
    confidence,
    primaryConcern: concernLabels[0] || "General skin health",
    primaryConcerns: primaryConcerns.length ? primaryConcerns : ["General skin health"],
    secondaryConcerns,
    concerns: concernLabels,
    ...scores,
    products,
    routines: buildRoutines(products, skinType),
    reasons: dedupeReasons(reasons).slice(0, 5),
    ingredients,
    lifestyle,
    timeline,
  };
}

function buildScores({ skinType, concerns, severity, duration, routine }) {
  const sevPenalty = severity === "severe" ? 22 : severity === "moderate" ? 12 : 5;
  const durPenalty = duration === "gt1y" ? 8 : duration === "3to12m" ? 5 : 2;
  const routineBonus = routine === "daily" ? 8 : routine === "sometimes" ? 4 : 0;
  const concernPenalty = Math.min(concerns.length, 5) * 3;

  const clamp = (n) => Math.max(24, Math.min(96, Math.round(n)));
  const has = (c) => concerns.includes(c);

  const skinScore = clamp(88 - sevPenalty - concernPenalty + routineBonus - durPenalty);

  let hydration = 78 + routineBonus;
  if (skinType === "dry") hydration -= 26;
  if (skinType === "sensitive") hydration -= 12;
  if (has("dryness")) hydration -= 16;
  if (has("dullness")) hydration -= 8;

  let oil = 80;
  if (skinType === "oily") oil -= 30;
  if (skinType === "combination") oil -= 16;
  if (has("acne") || has("pimples")) oil -= 12;

  let barrier = 82 + routineBonus;
  if (skinType === "sensitive") barrier -= 24;
  if (has("sensitive")) barrier -= 14;
  if (has("dryness")) barrier -= 12;
  if (severity === "severe") barrier -= 10;

  return {
    skinScore,
    hydrationScore: clamp(hydration),
    oilBalance: clamp(oil),
    barrierHealth: clamp(barrier),
  };
}

function buildIngredients(products) {
  const KNOWN = {
    "Salicylic Acid 2%": "Unclogs pores and dissolves excess oil.",
    "Salicylic Acid": "Exfoliates inside the pore to clear breakouts.",
    Niacinamide: "Regulates oil, calms redness and evens tone.",
    "Niacinamide 5%": "Regulates oil, calms redness and refines pores.",
    "Hyaluronic Acid": "Holds up to 1000× its weight in water for deep hydration.",
    Ceramides: "Rebuild the skin barrier and lock moisture in.",
    "5 Ceramides": "Restore a compromised barrier and seal hydration.",
    "Kojic Acid": "Fades dark spots by interrupting melanin production.",
    "Vitamin C": "Brightens tone and defends against free radicals.",
    "Benzoyl Peroxide 2.5%": "Kills acne-causing bacteria on contact.",
    Squalane: "Lightweight lipid that softens without clogging.",
    "Centella Asiatica": "Soothes irritation and speeds skin repair.",
    Biotin: "Strengthens hair from within to reduce shedding.",
    "Algal Omega-3": "Plant omega-3 to calm inflammation and dryness.",
  };
  const seen = new Set();
  const out = [];
  products.forEach((p) => {
    p.ingredients.forEach((ing) => {
      if (KNOWN[ing] && !seen.has(ing)) {
        seen.add(ing);
        out.push({ name: ing, benefit: KNOWN[ing] });
      }
    });
  });
  return out.slice(0, 6);
}

function buildLifestyle({ skinType, concerns }) {
  const tips = [
    { icon: "droplet", text: "Drink 2–3L of water daily — hydration shows on your skin first." },
    { icon: "sun", text: "Wear SPF 50 every morning, even indoors near windows." },
    { icon: "moon", text: "Aim for 7–8 hours of sleep so skin can repair overnight." },
  ];
  if (skinType === "oily" || concerns.includes("acne"))
    tips.push({ icon: "utensils", text: "Cut back on high-sugar, high-dairy foods that can trigger breakouts." });
  if (skinType === "dry" || concerns.includes("dryness"))
    tips.push({ icon: "wind", text: "Use a humidifier and avoid very hot showers to preserve moisture." });
  if (concerns.includes("dullness") || concerns.includes("pigmentation"))
    tips.push({ icon: "leaf", text: "Add antioxidant-rich foods — berries, greens, nuts — for glow." });
  if (concerns.includes("lowEnergy") || concerns.includes("gutHealth"))
    tips.push({ icon: "activity", text: "Move for 30 minutes a day to boost circulation and energy." });
  return tips.slice(0, 5);
}

function buildTimeline(severity) {
  const pace = severity === "severe" ? 1.4 : severity === "moderate" ? 1 : 0.8;
  const w = (n) => Math.max(1, Math.round(n * pace));
  return [
    { week: `Week ${w(1)}–${w(2)}`, title: "Adjustment", detail: "Skin adapts to actives; hydration improves." },
    { week: `Week ${w(3)}–${w(4)}`, title: "First results", detail: "Fewer breakouts, calmer tone, softer texture." },
    { week: `Week ${w(6)}–${w(8)}`, title: "Visible change", detail: "Spots fade, oil balances, glow returns." },
    { week: `Week ${w(10)}–${w(12)}`, title: "Transformation", detail: "Clear, resilient skin becomes your new baseline." },
  ];
}

function buildRoutines(products, skinType) {
  const byCat = (cat) => products.find((p) => p.category === cat);
  const cleanser = products.find((p) => p.category === "Cleanser");
  const moisturizer = byCat("Moisturizer");
  const bar = byCat("Cleansing Bar");
  const kit = products.find((p) => p.category.includes("Kit"));
  const wellness = products.filter((p) => p.category === "Wellness");

  const morning = [];
  if (cleanser) morning.push(`Cleanse with ${cleanser.name}`);
  if (skinType !== "oily") morning.push("Apply a pea-size layer of hydrating serum");
  if (moisturizer) morning.push(`Lock in with ${moisturizer.name}`);
  morning.push("Finish with broad-spectrum SPF 50 (non-negotiable)");

  const night = [];
  if (cleanser) night.push(`Double-cleanse with ${cleanser.name}`);
  if (kit) night.push(`Apply targeted treatment from ${kit.name}`);
  if (moisturizer) night.push(`Seal with ${moisturizer.name}`);
  if (wellness[0]) night.push(`Take ${wellness[0].name} with dinner`);

  const weekly = [];
  if (bar) weekly.push(`Use ${bar.name} 2–3× a week for brightening`);
  weekly.push("Gentle exfoliation once a week to renew skin");
  weekly.push("A hydrating mask on your rest day");

  return { morning, night, weekly };
}

function scoreConfidence({ concerns, severity, routine, products, allergies }) {
  let score = 82;
  score += Math.min(concerns.length, 4) * 2;
  if (severity === "moderate") score += 3;
  if (severity === "severe") score += 5;
  if (routine === "daily") score += 3;
  if (routine === "sometimes") score += 1;
  if (allergies === "yes") score -= 4;
  score += Math.min(products.length, 5);
  return Math.max(74, Math.min(98, Math.round(score)));
}

function dedupeReasons(reasons) {
  const seen = new Set();
  return reasons.filter((r) => (seen.has(r.title) ? false : (seen.add(r.title), true)));
}

// GlowAI "thinking" sequence between the assessment and the report.
export const THINKING_STEPS = [
  "Initializing AI engine…",
  "Understanding skin profile…",
  "Matching ingredients…",
  "Comparing Glovista formulations…",
  "Selecting dermatologist-approved products…",
  "Creating personalized skincare routine…",
];

// Selfie "scan" simulation steps (visual only — no image is analyzed).
export const SCAN_STEPS = [
  "Detecting forehead…",
  "Checking T-zone…",
  "Analyzing pores…",
  "Detecting pigmentation…",
  "Checking acne severity…",
  "Analyzing skin tone…",
  "Checking hydration…",
  "Checking sensitivity…",
  "Computing confidence…",
];

// Builds a believable "computer vision" report from the questionnaire answers.
// 100% frontend simulation — no image is processed. Values stay consistent with
// what the user told us so the demo feels coherent.
export function buildVisionReport(answers = {}) {
  const {
    skinType = "combination",
    concerns = [],
    severity = "moderate",
    allergies = "no",
    routine = "never",
    duration = "1to3m",
  } = answers;
  const has = (c) => concerns.includes(c);
  const s = buildScores({ skinType, concerns, severity, duration, routine });

  const oil =
    skinType === "oily" ? "High" :
    skinType === "combination" ? "Elevated" :
    skinType === "dry" ? "Low" : "Balanced";

  const acneRisk =
    has("acne") || has("pimples")
      ? severity === "severe" ? "High" : "Moderate"
      : skinType === "oily" ? "Moderate" : "Low";

  const pigmentation =
    has("pigmentation") || has("darkSpots")
      ? severity === "severe" ? "Moderate" : "Mild"
      : "Minimal";

  const sensitivity =
    skinType === "sensitive" || has("sensitive") || allergies === "yes"
      ? severity === "severe" ? "High" : "Moderate"
      : "Low";

  const barrier = s.barrierHealth >= 70 ? "Healthy" : s.barrierHealth >= 50 ? "Fair" : "Compromised";

  const confidence = Math.min(97, Math.max(92, 92 + ((concerns.length + (routine === "daily" ? 1 : 0)) % 6)));

  return {
    confidence,
    hydrationPct: s.hydrationScore,
    oilPct: 100 - s.oilBalance, // higher = more oil
    metrics: [
      { label: "Skin Type", value: label("skinType", skinType), tone: "info" },
      { label: "Hydration", value: `${s.hydrationScore}%`, tone: s.hydrationScore >= 65 ? "good" : "warn", pct: s.hydrationScore },
      { label: "Oil Production", value: oil, tone: oil === "High" || oil === "Elevated" ? "warn" : "info" },
      { label: "Acne Risk", value: acneRisk, tone: acneRisk === "High" ? "bad" : acneRisk === "Moderate" ? "warn" : "good" },
      { label: "Pigmentation", value: pigmentation, tone: pigmentation === "Moderate" ? "warn" : pigmentation === "Mild" ? "info" : "good" },
      { label: "Sensitivity", value: sensitivity, tone: sensitivity === "High" ? "warn" : sensitivity === "Moderate" ? "info" : "good" },
      { label: "Skin Barrier", value: barrier, tone: barrier === "Healthy" ? "good" : barrier === "Fair" ? "warn" : "bad" },
    ],
  };
}
