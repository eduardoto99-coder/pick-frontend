const USER_ID_KEY = "pick:userId";
const PROFILE_COMPLETE_KEY = "pick:profileComplete";
const DISPLAY_NAME_KEY = "pick:displayName";
const ACCESS_TOKEN_KEY = "pick:accessToken";
const ID_TOKEN_KEY = "pick:idToken";
const REFRESH_TOKEN_KEY = "pick:refreshToken";
const TOKEN_EXPIRES_AT_KEY = "pick:tokenExpiresAt";

export type StoredAuthTokens = {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
};

export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_ID_KEY);
}

export function persistStoredUserId(userId: string) {
  if (typeof window === "undefined" || !userId) return;
  window.localStorage.setItem(USER_ID_KEY, userId);
}

export function clearStoredUserId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_ID_KEY);
}

export function persistStoredAuthTokens(tokens: StoredAuthTokens) {
  if (typeof window === "undefined") return;

  const idToken = typeof tokens.idToken === "string" ? tokens.idToken.trim() : "";
  const accessToken = typeof tokens.accessToken === "string" ? tokens.accessToken.trim() : "";
  const refreshToken = typeof tokens.refreshToken === "string" ? tokens.refreshToken.trim() : "";
  const expiresIn = typeof tokens.expiresIn === "number" ? tokens.expiresIn : undefined;

  if (idToken) {
    window.localStorage.setItem(ID_TOKEN_KEY, idToken);
  } else {
    window.localStorage.removeItem(ID_TOKEN_KEY);
  }

  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (typeof expiresIn === "number" && Number.isFinite(expiresIn) && expiresIn > 0) {
    const expiresAt = Date.now() + expiresIn * 1000;
    window.localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  } else {
    window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  }
}

export function getStoredIdToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(ID_TOKEN_KEY);
  return token && token.trim().length > 0 ? token : null;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return token && token.trim().length > 0 ? token : null;
}

export function getStoredBearerToken(): string | null {
  const idToken = getStoredIdToken();
  if (idToken) return idToken;
  return getStoredAccessToken();
}

export function getAuthorizationHeaderValue(): string | null {
  const bearerToken = getStoredBearerToken();
  if (!bearerToken) return null;
  return `Bearer ${bearerToken}`;
}

export function hasStoredAuthSession(): boolean {
  const token = getStoredBearerToken();
  if (!token) return false;
  if (typeof window === "undefined") return true;

  const rawExpiresAt = window.localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  if (!rawExpiresAt) {
    return true;
  }

  const expiresAt = Number(rawExpiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
    return true;
  }

  if (Date.now() < expiresAt) {
    return true;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  return false;
}

export function clearStoredAuthTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
}

export function getStoredDisplayName(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DISPLAY_NAME_KEY);
}

export function persistStoredDisplayName(displayName: string) {
  if (typeof window === "undefined" || !displayName) return;
  window.localStorage.setItem(DISPLAY_NAME_KEY, displayName);
}

export function clearStoredDisplayName() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DISPLAY_NAME_KEY);
}

export function markProfileComplete() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_COMPLETE_KEY, "true");
}

export function clearProfileCompleteFlag() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_COMPLETE_KEY);
}

export function isProfileMarkedComplete(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PROFILE_COMPLETE_KEY) === "true";
}
