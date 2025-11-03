import { defaultLocale, isLocale } from "./config";
import type { LandingDictionary, Locale } from "./types";

const dictionaries: Record<Locale, () => Promise<LandingDictionary>> = {
  es: () => import("./dictionaries/es").then((mod) => mod.default),
  en: () => import("./dictionaries/en").then((mod) => mod.default),
};

export async function getDictionary(locale: string | undefined): Promise<LandingDictionary> {
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[resolvedLocale]();
}
