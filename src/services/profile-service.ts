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

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "No se pudo guardar el perfil.");
  }

  try {
    const json = await response.json();
    return {
      updatedAt: json?.updatedAt,
      photoUrl: json?.photoUrl,
    };
  } catch {
    return {};
  }
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

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "No pudimos cargar tu perfil.");
  }

  const json = await response.json();
  if (!json?.profile) {
    return null;
  }

  return {
    displayName: json.profile.displayName ?? "",
    bio: json.profile.bio ?? "",
    whatsappNumber:
      typeof json.profile.whatsappNumber === "string" ? json.profile.whatsappNumber : undefined,
    linkedinUrl:
      typeof json.profile.linkedinUrl === "string" ? json.profile.linkedinUrl : undefined,
    instagramUrl:
      typeof json.profile.instagramUrl === "string" ? json.profile.instagramUrl : undefined,
    cities: Array.isArray(json.profile.cities) ? json.profile.cities : [],
    interests: Array.isArray(json.profile.interests) ? json.profile.interests : [],
    photoUrl: typeof json.profile.photoUrl === "string" ? json.profile.photoUrl : undefined,
    updatedAt: json.profile.updatedAt,
  };
}
