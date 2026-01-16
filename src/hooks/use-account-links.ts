"use client";

import { useEffect, useState } from "react";
import {
  clearProfileCompleteFlag,
  clearStoredUserId,
  getStoredUserId,
  persistStoredUserId,
} from "@/utils/local-user";

export function useAccountLinks(locale = "es") {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const normalizedLocale = locale || "es";

  const profileHref = `/${normalizedLocale}/profile`;
  const matchesHref = `/${normalizedLocale}/matches`;
  const signInHref = `/${normalizedLocale}/auth/sign-in`;
  const signUpHref = `/${normalizedLocale}/auth/sign-up`;

  // Hydrate session data from local storage after mount.
  useEffect(() => {
    const storedUserId = getStoredUserId();
    if (storedUserId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(storedUserId);
    }
    setReady(true);
  }, []);

  return {
    ready,
    hasSession: Boolean(userId),
    profileHref,
    matchesHref,
    signInHref,
    signUpHref,
    accountHref: userId ? profileHref : signInHref,
    persistSession: (nextUserId: string) => {
      persistStoredUserId(nextUserId);
      setUserId(nextUserId);
      setReady(true);
    },
    signOut: () => {
      clearStoredUserId();
      clearProfileCompleteFlag();
      setUserId(null);
      setReady(true);
    },
  };
}
