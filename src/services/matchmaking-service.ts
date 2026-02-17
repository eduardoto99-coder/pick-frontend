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
type ApiErrorPayload = {
  code?: string;
  message?: string;
  retryAfterSeconds?: number;
};

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

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function formatRetryAfter(seconds: number): string {
  const safeSeconds = Math.max(1, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  if (minutes <= 0) {
    return `${remainingSeconds}s`;
  }
  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds}s`;
}

function normalizeError(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiErrorPayload;
    if (record.code === "rate_limited" && typeof record.retryAfterSeconds === "number") {
      return `Demasiados intentos por ahora. Intenta nuevamente en ${formatRetryAfter(
        record.retryAfterSeconds,
      )}.`;
    }
    if (typeof record.message === "string" && record.message.trim().length > 0) {
      return record.message;
    }
  }

  return fallback;
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
    const payload = await parseResponse(response);
    throw new Error(normalizeError(payload, "No se pudo obtener la lista de coincidencias."));
  }

  const json = (await parseResponse(response)) as Record<string, unknown> | undefined;
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
    const payload = await parseResponse(response);
    throw new Error(normalizeError(payload, "No pudimos preparar el dashboard de matches."));
  }

  const json = (await parseResponse(response)) as Record<string, unknown> | undefined;
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
    const responsePayload = await parseResponse(response);
    throw new Error(normalizeError(responsePayload, "No pudimos crear el mensaje."));
  }

  return (await parseResponse(response)) as MatchIntroResponse;
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
    const responsePayload = await parseResponse(response);
    throw new Error(normalizeError(responsePayload, "No pudimos registrar el clic de WhatsApp."));
  }
}
