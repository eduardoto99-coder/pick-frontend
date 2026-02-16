"use client";

import { useEffect, useState } from "react";
import {
  clearProfileCompleteFlag,
  clearStoredAuthTokens,
  clearStoredDisplayName,
  clearStoredUserId,
  getStoredBearerToken,
  hasStoredAuthSession,
  persistStoredAuthTokens,
  persistStoredUserId,
} from "@/utils/local-user";

export function useAccountLinks(locale = "es") {
  const [hasAuthSession, setHasAuthSession] = useState(false);
  const [ready, setReady] = useState(false);
  const normalizedLocale = locale || "es";

  const profileHref = `/${normalizedLocale}/profile`;
  const matchesHref = `/${normalizedLocale}/matches`;
  const signInHref = `/${normalizedLocale}/auth/sign-in`;
  const signUpHref = `/${normalizedLocale}/auth/sign-up`;

  // Hydrate session data from local storage after mount.
  useEffect(() => {
    const storedToken = getStoredBearerToken();
    if (storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasAuthSession(hasStoredAuthSession());
    }
    setReady(true);
  }, []);

  return {
    ready,
    hasSession: hasAuthSession,
    profileHref,
    matchesHref,
    signInHref,
    signUpHref,
    accountHref: hasAuthSession ? profileHref : signInHref,
    persistSession: (nextSession: {
      userId?: string;
      accessToken?: string;
      idToken?: string;
      refreshToken?: string;
      expiresIn?: number;
    }) => {
      persistStoredAuthTokens(nextSession);
      if (nextSession.userId) {
        persistStoredUserId(nextSession.userId);
      }
      setHasAuthSession(hasStoredAuthSession());
      setReady(true);
    },
    signOut: () => {
      clearStoredAuthTokens();
      clearStoredUserId();
      clearStoredDisplayName();
      clearProfileCompleteFlag();
      setHasAuthSession(false);
      setReady(true);
    },
  };
}
