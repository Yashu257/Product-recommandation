/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper background
        paper: "#FAF9F5",
        // Soft sage — the brand's quiet green (also aliased as `mint` for
        // backward compatibility with existing AI components).
        sage: {
          50: "#F5F7F3",
          100: "#E9EEE6",
          200: "#D4DDCE",
          300: "#B6C4AE",
          400: "#93A489",
          500: "#74856A",
          600: "#5B6B53",
          700: "#495643",
          800: "#3C4638",
          900: "#333B30",
        },
        // Dusty powder blue — used only as a light accent.
        powder: {
          50: "#F2F6F8",
          100: "#E5EEF1",
          200: "#CDDDE3",
          300: "#A9C4CE",
          400: "#83A5B4",
          500: "#66899A",
          600: "#547181",
          700: "#465D6A",
          800: "#3C4E59",
          900: "#34424B",
        },
        // Warm sand / beige accent
        sand: {
          50: "#FBF8F3",
          100: "#F4EEE3",
          200: "#EAE0CF",
          300: "#DBCBB0",
          400: "#C8B18A",
          500: "#B39A6C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      fontWeight: {
        500: "500",
        600: "600",
        700: "700",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(28,25,23,0.04)",
        sm: "0 1px 3px rgba(28,25,23,0.06), 0 1px 2px -1px rgba(28,25,23,0.04)",
        card: "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px -20px rgba(28,25,23,0.18)",
        hover: "0 2px 6px rgba(28,25,23,0.05), 0 22px 48px -24px rgba(28,25,23,0.22)",
        header: "0 1px 0 rgba(28,25,23,0.06)",
      },
      letterSpacing: {
        tightest: "-0.02em",
        wideish: "0.14em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        shimmer: "shimmer 1.8s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

// Legacy aliases: map `mint` -> sage and `sky` -> powder so existing AI
// components render in the new muted palette without touching every class.
module.exports.theme.extend.colors.mint = module.exports.theme.extend.colors.sage;
module.exports.theme.extend.colors.sky = module.exports.theme.extend.colors.powder;
