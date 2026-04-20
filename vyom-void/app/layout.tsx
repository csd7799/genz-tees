import type { Metadata } from "next";
import { Syne, Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";

/* ===== Google Fonts ===== */
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

/* ===== SEO Metadata ===== */
export const metadata: Metadata = {
  title: "VYOM VOID — Cosmic Streetwear from the Void",
  description:
    "Where the sky meets nothingness. Indian-rooted cosmic streetwear for Gen Z. Limited drops inspired by Sanskrit philosophy and deep space.",
  keywords: [
    "VYOM VOID",
    "streetwear",
    "Indian streetwear",
    "cosmic fashion",
    "Gen Z fashion",
    "limited drops",
    "Sanskrit streetwear",
    "void fashion",
    "dark aesthetic clothing",
  ],
  openGraph: {
    title: "VYOM VOID — Cosmic Streetwear from the Void",
    description:
      "Where the sky meets nothingness. Indian-rooted cosmic streetwear for Gen Z.",
    siteName: "VYOM VOID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-dm bg-[#0A0A0F] text-[#E8E8F0] antialiased">
        <LoadingScreen />
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
