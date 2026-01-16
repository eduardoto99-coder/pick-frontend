import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./src/i18n/config";

function detectLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const candidate = segments[0];
  if (candidate && locales.includes(candidate as (typeof locales)[number])) {
    return candidate;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const locale = detectLocale(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pick-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon.svg|api).*)"],
};
