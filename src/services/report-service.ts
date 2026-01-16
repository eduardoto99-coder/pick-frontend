import { getStoredUserId } from "@/utils/local-user";

export type ReportUserPayload = {
  reportedUserId: string;
  reason?: string;
  context?: string;
};

export async function reportUser(payload: ReportUserPayload): Promise<{ reportedAt?: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const localUserId = typeof window !== "undefined" ? getStoredUserId() : null;

  if (!apiUrl) {
    throw new Error("El servicio de reportes no está configurado.");
  }

  const response = await fetch(`${apiUrl}/reports`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(localUserId ? { "x-pick-user-id": localUserId } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "No pudimos enviar el reporte.";
    const text = await response.text();
    if (text) {
      try {
        const json = JSON.parse(text) as { message?: string };
        if (json?.message) {
          message = json.message;
        } else {
          message = text;
        }
      } catch {
        message = text;
      }
    }
    throw new Error(message);
  }

  try {
    const json = await response.json();
    return { reportedAt: json?.reportedAt };
  } catch {
    return {};
  }
}
