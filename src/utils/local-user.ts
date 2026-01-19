const USER_ID_KEY = "pick:userId";
const PROFILE_COMPLETE_KEY = "pick:profileComplete";
const DISPLAY_NAME_KEY = "pick:displayName";

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
