import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Fraunces: a warm, optical serif — editorial and premium without being flashy.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Glovista — Clinically-informed skincare, intelligently personalized",
  description:
    "Glovista makes considered, dermatologist-tested skincare — and GlowAI, an in-house AI consultant that helps you find the right routine for your skin.",
  keywords: ["Glovista", "skincare", "GlowAI", "AI skin analysis", "dermatologist tested", "clean skincare"],
};

export const viewport = {
  themeColor: "#faf9f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-paper font-sans antialiased">{children}</body>
    </html>
  );
}
