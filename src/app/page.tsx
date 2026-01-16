"use client";

import { useEffect } from "react";
import { defaultLocale } from "@/i18n/config";

export default function IndexPage() {
  useEffect(() => {
    // Client-side redirect keeps static export compatible.
    window.location.replace(`/${defaultLocale}/`);
  }, []);

  return null;
}
