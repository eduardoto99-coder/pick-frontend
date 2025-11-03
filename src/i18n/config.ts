import type { Locale } from "./types";

export const locales: readonly Locale[] = ["es", "en"];

export const defaultLocale: Locale = "es";

export function isLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}
