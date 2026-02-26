import type { ProfileDraft } from "@/types/profile";
import { getAuthorizationHeaderValue } from "@/utils/local-user";

export type PersistedProfilePayload = {
  profile: {
    displayName: string;
    bio: string;
    whatsappNumber: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    photoDataUrl?: string;
    existingPhotoUrl?: string;
  };
  cities: string[];
  interests: string[];
};

function buildAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "content-type": "application/json",
  };
  const authorization = getAuthorizationHeaderValue();
  if (authorization) {
    headers.Authorization = authorization;
  }
  return headers;
}

export function buildProfilePayload(draft: ProfileDraft): PersistedProfilePayload {
  const whatsappNumber = draft.whatsappNumber.trim();
  const linkedinUrl = draft.linkedinUrl.trim();
  const instagramUrl = draft.instagramUrl.trim();

  return {
    profile: {
      displayName: draft.displayName.trim(),
      bio: draft.bio.trim(),
      whatsappNumber,
      linkedinUrl: linkedinUrl.length > 0 ? linkedinUrl : undefined,
      instagramUrl: instagramUrl.length > 0 ? instagramUrl : undefined,
      photoDataUrl: draft.photo?.dataUrl,
      existingPhotoUrl: draft.existingPhotoUrl,
    },
    cities: draft.cities,
    interests: draft.interests,
  };
}

type PersistProfileResult = {
  updatedAt?: string;
  photoUrl?: string;
};

function readErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim().length > 0) {
      return record.message;
    }
    if (typeof record.error === "string" && record.error.trim().length > 0) {
      return record.error;
    }
  }

  return fallback;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) {
    return undefined;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function persistProfile(draft: ProfileDraft): Promise<PersistProfileResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const payload = buildProfilePayload(draft);

  if (!apiUrl) {
    throw new Error("El servicio de perfiles no está configurado.");
  }

  const response = await fetch(`${apiUrl}/profiles`, {
    method: "PUT",
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const responseBody = await parseResponseBody(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(responseBody, "No se pudo guardar el perfil."));
  }

  if (!responseBody || typeof responseBody !== "object") {
    return {};
  }

  const json = responseBody as Record<string, unknown>;
  return {
    updatedAt: typeof json.updatedAt === "string" ? json.updatedAt : undefined,
    photoUrl: typeof json.photoUrl === "string" ? json.photoUrl : undefined,
  };
}

export type LoadedProfile = {
  displayName: string;
  bio: string;
  whatsappNumber?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  cities: string[];
  interests: string[];
  photoUrl?: string;
  updatedAt?: string;
};

export async function fetchProfile(): Promise<LoadedProfile | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("El servicio de perfiles no está configurado.");
  }

  const response = await fetch(`${apiUrl}/profiles/me`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  const responseBody = await parseResponseBody(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(responseBody, "No pudimos cargar tu perfil."));
  }

  if (!responseBody || typeof responseBody !== "object") {
    return null;
  }

  const json = responseBody as Record<string, unknown>;
  if (!json.profile || typeof json.profile !== "object") {
    return null;
  }
  const profile = json.profile as Record<string, unknown>;

  return {
    displayName: typeof profile.displayName === "string" ? profile.displayName : "",
    bio: typeof profile.bio === "string" ? profile.bio : "",
    whatsappNumber:
      typeof profile.whatsappNumber === "string" ? profile.whatsappNumber : undefined,
    linkedinUrl:
      typeof profile.linkedinUrl === "string" ? profile.linkedinUrl : undefined,
    instagramUrl:
      typeof profile.instagramUrl === "string" ? profile.instagramUrl : undefined,
    cities: Array.isArray(profile.cities)
      ? profile.cities.filter((value): value is string => typeof value === "string")
      : [],
    interests: Array.isArray(profile.interests)
      ? profile.interests.filter((value): value is string => typeof value === "string")
      : [],
    photoUrl: typeof profile.photoUrl === "string" ? profile.photoUrl : undefined,
    updatedAt: typeof profile.updatedAt === "string" ? profile.updatedAt : undefined,
  };
}
