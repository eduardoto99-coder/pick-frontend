import { getAuthorizationHeaderValue } from "@/utils/local-user";

export type MatchCompatibility = "perfect" | "strong" | "compatible";

export type MatchIntroPreview = {
  matchCode: string;
  message: string;
  whatsappUrl: string;
  sharedCities: string[];
  sharedInterests: string[];
  sponsor?: {
    name?: string;
    tagline?: string;
  };
};

export type MatchRecommendation = {
  userId: string;
  displayName: string;
  bio?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  photoUrl?: string;
  sharedCities: string[];
  sharedInterests: string[];
  score: number;
  compatibility: MatchCompatibility;
  introPreview?: MatchIntroPreview;
  whatsappIntroAt?: string;
};

export type MatchIntroResponse = {
  matchCode: string;
  message: string;
  whatsappUrl: string;
  sharedCities: string[];
  sharedInterests: string[];
  sponsor?: {
    name?: string;
    tagline?: string;
  };
};

export type WhatsappClickPayload = {
  partnerId: string;
  matchCode?: string;
  sharedCities?: string[];
  sharedInterests?: string[];
  sponsor?: {
    name?: string;
    tagline?: string;
  };
  source?: "match_intro";
};

const DEFAULT_LIMIT = 5;

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "content-type": "application/json",
  };
  const authorization = getAuthorizationHeaderValue();
  if (authorization) {
    headers.Authorization = authorization;
  }
  return headers;
}

export async function fetchMatchRecommendations(
  limit = DEFAULT_LIMIT,
): Promise<MatchRecommendation[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de coincidencias no está configurado.");
  }

  const normalizedLimit = Math.max(1, Math.min(limit, 20));
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedApiUrl}/matches`);
  url.searchParams.set("limit", String(normalizedLimit));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No se pudo obtener la lista de coincidencias.");
  }

  const json = await response.json();
  return Array.isArray(json?.matches) ? (json.matches as MatchRecommendation[]) : [];
}

export async function fetchMatchDashboard(
  limit = DEFAULT_LIMIT,
): Promise<MatchRecommendation[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El dashboard de matches no está configurado.");
  }

  const normalizedLimit = Math.max(1, Math.min(limit, 20));
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedApiUrl}/matches/dashboard`);
  url.searchParams.set("limit", String(normalizedLimit));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos preparar el dashboard de matches.");
  }

  const json = await response.json();
  return Array.isArray(json?.matches) ? (json.matches as MatchRecommendation[]) : [];
}

export async function requestMatchIntro(
  matchUserId: string,
  matchCode?: string,
): Promise<MatchIntroResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de mensajes no está configurado.");
  }

  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const payload: Record<string, string> = { matchUserId };
  if (matchCode) {
    payload.matchCode = matchCode;
  }

  const response = await fetch(`${normalizedApiUrl}/matches/intro`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos crear el mensaje.");
  }

  return (await response.json()) as MatchIntroResponse;
}

export async function logWhatsappClick(payload: WhatsappClickPayload): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de analytics no está configurado.");
  }

  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const response = await fetch(`${normalizedApiUrl}/analytics/whatsapp-click`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos registrar el clic de WhatsApp.");
  }
}
