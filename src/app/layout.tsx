import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
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
      en: "/en",
    },
  },
  openGraph: {
    title: "Pick | One-to-one intros that build lasting circles",
    description:
      "Interest-first matching, AI-crafted WhatsApp intros, and trusted follow-ups designed for meaningful one-to-one relationships.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pick | One-to-one intros that build lasting circles",
    description:
      "Interest-first matching, AI-crafted WhatsApp intros, and trusted follow-ups designed for meaningful one-to-one relationships.",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;
  const lang = locale ?? "es";

  return (
    <html lang={lang}>
      <body className={`${sora.variable} ${inter.variable}`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
