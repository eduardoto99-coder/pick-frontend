import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { defaultLocale } from "@/i18n/config";
import ThemeRegistry from "@/theme/ThemeRegistry";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pick | Introducciones uno a uno que construyen círculos duraderos",
    template: "%s | Pick",
  },
  description:
    "Pick conecta a creadores, exploradores culturales y catalizadores comunitarios con presentaciones uno a uno, handoffs por WhatsApp y seguimiento seguro.",
  alternates: {
    languages: {
      es: "/es",
      // en: "/en", // TODO: publish English once ready
    },
  },
  openGraph: {
    title: "Pick | Introducciones uno a uno que construyen círculos duraderos",
    description:
      "Matching por intereses, intros por WhatsApp y seguimiento seguro diseñados para conexiones uno a uno con intención.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pick | One-to-one intros that build lasting circles",
    description:
      "Interest-first matching, WhatsApp intros crafted with artificial intelligence, and trusted follow-ups designed for meaningful one-to-one relationships.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = defaultLocale;
  const skipLabel = "Saltar al contenido principal";

  return (
    <html lang={lang}>
      <body className={`${sora.variable} ${inter.variable}`}>
        <a href="#main-content" className="skip-link">
          {skipLabel}
        </a>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
