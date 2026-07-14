# GlowAI — by Glovista

A premium, production-quality AI demo. **GlowAI**, your Personal AI Skin & Wellness
Consultant, interviews the user conversationally (one question at a time, with natural
acknowledgements), optionally runs a simulated selfie scan, then generates a full
personalized skin report from the Glovista catalog — scores, routines, ingredients,
lifestyle tips, an improvement timeline, and a match-confidence rating.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS 3** — glassmorphism, soft green + sky blue system, **light/dark mode**
- **Framer Motion** — page transitions, blobs, particles, typing, glow rings, confetti
- **Lucide Icons**
- **canvas-confetti** — celebration on the report

## Experience flow

`landing → conversational assessment → optional selfie scan → AI thinking → report`

- **Meet GlowAI** hero with a breathing, ring-orbited avatar.
- **Conversational chat** — GlowAI asks one question at a time, shows a "GlowAI is
  thinking…" indicator, and reacts to each answer before the next question.
- **Selfie upload (optional)** — a simulated 6-step AI scan. The image never leaves the
  browser and is not actually analyzed; it's a demo simulation.
- **AI thinking** — rotating glow rings, a 6-step checklist, and a progress bar.
- **Report** — skin/hydration/oil/barrier score radials, primary & secondary concerns,
  recommended products (with "Why GlowAI chose this" + "Suitable for"), morning/night/
  weekly routines, recommended ingredients, lifestyle tips, an improvement timeline,
  confetti, and **Download PDF / Email / Share / Print** export actions.
- **Dark/light mode** toggle (persisted), loading skeletons, animated particles.

## Getting started

```bash
cd glovista-ai
npm install
npm run dev
```

Open http://localhost:3000

## Architecture

```
app/
  layout.jsx         # fonts, metadata, global backdrop
  page.jsx           # stage machine: landing → assessment → thinking → results
  globals.css        # glass utilities, buttons, animations
components/
  AnimatedBackground # gradient blobs + drifting particles
  Navbar / Hero / LandingSections / Footer
  AssessmentChat     # ChatGPT-style conversational flow
  ChatBubble         # bubbles + typewriter
  TypingIndicator / ProgressBar / AIAvatar
  ThinkingScreen     # animated analysis sequence
  Results            # summary, product grid, routines, science, confidence
  ProductCard        # animated card w/ gradient image placeholder
  Confetti
data/
  products.js        # Glovista catalog (realistic content)
  questions.js       # the 9-step interview
lib/
  recommend.js       # deterministic, explainable recommendation engine
```

## Recommendation logic

`lib/recommend.js` implements rule-based matching (oily + acne → AuraMatte Kit, dry →
Skin Barrier Kit, pigmentation → KoziGleam, men + oily → Core Man Kit, plus wellness
concerns like hair fall, gut, bone, energy). It is budget-aware, builds three routines,
returns ingredient reasons, and computes a confidence score. Fully client-side.

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import your repository: `Yashu257/AI-Product-Recommandation`
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Your app will be live at a Vercel URL within minutes!

### Environment Variables

No environment variables are required for this demo. All AI logic runs client-side.
