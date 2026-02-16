import { getAuthorizationHeaderValue } from "@/utils/local-user";
import type { FeedbackOutcome } from "@/sections/matches/matches-copy";

export type FeedbackEligibilityResponse = {
  shouldPrompt: boolean;
  eligibleAt?: string;
  milestoneId?: "day_2" | "month_1" | "month_6";
  lastSubmittedAt?: string;
  reason?: string;
};

export type FeedbackSubmissionPayload = {
  aiMessageQuality: number;
  outcome: FeedbackOutcome;
  matchCode?: string;
  comment?: string;
};

export type FeedbackSubmissionResponse = {
  message: string;
  submittedAt: string;
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

export async function fetchFeedbackEligibility(): Promise<FeedbackEligibilityResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de feedback no está configurado.");
  }

  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedApiUrl}/feedback/eligibility`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos consultar la elegibilidad de feedback.");
  }

  return (await response.json()) as FeedbackEligibilityResponse;
}

export async function submitFeedback(
  payload: FeedbackSubmissionPayload,
): Promise<FeedbackSubmissionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El servicio de feedback no está configurado.");
  }

  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  const response = await fetch(`${normalizedApiUrl}/feedback/submit`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No pudimos guardar tu feedback.");
  }

  return (await response.json()) as FeedbackSubmissionResponse;
}
