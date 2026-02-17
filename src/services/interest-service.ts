import { getAuthorizationHeaderValue } from "@/utils/local-user";

export type InterestOption = {
  id: string;
  label: string;
  description?: string;
  pillar?: string;
};

export type ResolveInterestResponse = {
  interestId: string;
  matched: boolean;
  created: boolean;
  label: string;
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

export async function fetchInterests(query?: string): Promise<InterestOption[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de intereses no está configurado.");
  }

  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedApiUrl}/interests/search`);
  if (query) {
    url.searchParams.set("q", query);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos cargar los intereses.");
  }

  const json = await response.json();
  return Array.isArray(json?.interests) ? (json.interests as InterestOption[]) : [];
}

export async function resolveInterestLabel(label: string): Promise<ResolveInterestResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de intereses no está configurado.");
  }

  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const response = await fetch(`${normalizedApiUrl}/interests/resolve`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ label }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos resolver este interés.");
  }

  return (await response.json()) as ResolveInterestResponse;
}
