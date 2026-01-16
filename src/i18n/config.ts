import type { Locale } from "./types";

export const locales: readonly Locale[] = [
  "es",
  // "en", // TODO: re-enable English once the copy is ready
];

export const defaultLocale: Locale = "es";

export function isLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}
