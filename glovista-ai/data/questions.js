import {
  User,
  Users,
  Droplets,
  Sparkles,
  Gauge,
  Clock,
  CalendarCheck,
  ShieldAlert,
  Wallet,
} from "lucide-react";

// The AI Dermatologist interview. Each step drives one chat exchange.
// `type`:
//   - "number"  → age input (validated)
//   - "single"  → pick exactly one
//   - "multi"   → pick one or more
export const QUESTIONS = [
  {
    id: "age",
    type: "number",
    icon: User,
    prompt: "Let's start simple — how old are you?",
    hint: "Your age helps me calibrate ingredient strength and routine pace.",
    min: 10,
    max: 99,
    placeholder: "e.g. 27",
  },
  {
    id: "gender",
    type: "single",
    icon: Users,
    prompt: "And how do you identify?",
    hint: "Some formulations are tuned for different skin physiology.",
    options: [
      { value: "female", label: "Female", emoji: "🌷" },
      { value: "male", label: "Male", emoji: "🧔" },
      { value: "other", label: "Prefer not to say", emoji: "🙂" },
    ],
  },
  {
    id: "skinType",
    type: "single",
    icon: Droplets,
    prompt: "How would you describe your skin type?",
    hint: "Not sure? Think about how your skin feels a few hours after washing.",
    options: [
      { value: "oily", label: "Oily", emoji: "💦", desc: "Shine, visible pores" },
      { value: "dry", label: "Dry", emoji: "🏜️", desc: "Tight, flaky" },
      { value: "combination", label: "Combination", emoji: "🌗", desc: "Oily T-zone" },
      { value: "normal", label: "Normal", emoji: "🌟", desc: "Balanced" },
      { value: "sensitive", label: "Sensitive", emoji: "🌸", desc: "Reacts easily" },
    ],
  },
  {
    id: "concerns",
    type: "multi",
    icon: Sparkles,
    prompt: "What are your primary concerns? Pick all that apply.",
    hint: "I'll prioritize the ones that matter most to you.",
    options: [
      { value: "acne", label: "Acne", emoji: "🔴" },
      { value: "pimples", label: "Pimples", emoji: "🟠" },
      { value: "darkSpots", label: "Dark Spots", emoji: "🟤" },
      { value: "pigmentation", label: "Pigmentation", emoji: "🟣" },
      { value: "dryness", label: "Dryness", emoji: "🏜️" },
      { value: "dullness", label: "Dullness", emoji: "☁️" },
      { value: "sensitive", label: "Sensitive Skin", emoji: "🌸" },
      { value: "stretchMarks", label: "Stretch Marks", emoji: "〰️" },
      { value: "hairFall", label: "Hair Fall", emoji: "💇" },
      { value: "gutHealth", label: "Gut Health", emoji: "🦠" },
      { value: "heartHealth", label: "Heart Health", emoji: "❤️" },
      { value: "boneHealth", label: "Bone Health", emoji: "🦴" },
      { value: "lowEnergy", label: "Low Energy", emoji: "🔋" },
    ],
  },
  {
    id: "severity",
    type: "single",
    icon: Gauge,
    prompt: "How intense would you say your main concern is?",
    hint: "This sets the strength of the actives I recommend.",
    options: [
      { value: "mild", label: "Mild", emoji: "🟢", desc: "Occasional, subtle" },
      { value: "moderate", label: "Moderate", emoji: "🟡", desc: "Noticeable" },
      { value: "severe", label: "Severe", emoji: "🔴", desc: "Persistent" },
    ],
  },
  {
    id: "duration",
    type: "single",
    icon: Clock,
    prompt: "How long have you been dealing with this?",
    hint: "Longer-standing concerns often need a more layered approach.",
    options: [
      { value: "lt1m", label: "Less than 1 month", emoji: "🌱" },
      { value: "1to3m", label: "1–3 months", emoji: "🌿" },
      { value: "3to12m", label: "3–12 months", emoji: "🍂" },
      { value: "gt1y", label: "More than 1 year", emoji: "🌳" },
    ],
  },
  {
    id: "routine",
    type: "single",
    icon: CalendarCheck,
    prompt: "What's your current skincare routine like?",
    hint: "No judgment — this helps me pace the plan to your habits.",
    options: [
      { value: "never", label: "Never", emoji: "🆕", desc: "Starting fresh" },
      { value: "sometimes", label: "Sometimes", emoji: "🔁", desc: "On and off" },
      { value: "daily", label: "Daily", emoji: "✅", desc: "Consistent" },
    ],
  },
  {
    id: "allergies",
    type: "single",
    icon: ShieldAlert,
    prompt: "Do you have any known allergies or reactions to skincare?",
    hint: "I'll lean toward gentle, fragrance-conscious picks if so.",
    options: [
      { value: "yes", label: "Yes", emoji: "⚠️" },
      { value: "no", label: "No", emoji: "👍" },
    ],
  },
  {
    id: "budget",
    type: "single",
    icon: Wallet,
    prompt: "Last one — what monthly budget works for you?",
    hint: "I'll build the best routine that respects your budget.",
    options: [
      { value: "300to500", label: "₹300 – ₹500", emoji: "💚" },
      { value: "500to1000", label: "₹500 – ₹1000", emoji: "💙" },
      { value: "1000plus", label: "₹1000+", emoji: "💎" },
    ],
  },
];

export const TOTAL_STEPS = QUESTIONS.length;
