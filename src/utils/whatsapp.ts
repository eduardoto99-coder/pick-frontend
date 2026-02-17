const mobileUserAgentPattern = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i;
const WHATSAPP_OPEN_DEBOUNCE_MS = 1200;

let lastOpenedUrl = "";
let lastOpenedAt = 0;

export type PreparedWhatsAppOpen = {
  isMobile: boolean;
  popup: Window | null;
};

function isMobileClient() {
  const userAgent = window.navigator.userAgent ?? "";
  return mobileUserAgentPattern.test(userAgent);
}

function buildDesktopWhatsappUrl(rawUrl: string): string {
  try {
    const source = new URL(rawUrl);
    const host = source.hostname.replace(/^www\./, "");
    const isWaHost =
      host === "wa.me" || host === "api.whatsapp.com" || host === "web.whatsapp.com";
    if (!isWaHost) {
      return rawUrl;
    }

    let phone = "";
    const phoneFromQuery =
      source.searchParams.get("phone") ??
      source.searchParams.get("phoneNumber") ??
      source.searchParams.get("recipient") ??
      "";
    if (host === "wa.me") {
      phone = source.pathname.replace(/\//g, "").trim().replace(/\D/g, "");
      if (!phone) {
        phone = phoneFromQuery.replace(/\D/g, "");
      }
    } else {
      phone = phoneFromQuery.replace(/\D/g, "");
    }

    const text =
      source.searchParams.get("text") ??
      source.searchParams.get("message") ??
      "";

    const desktopUrl = new URL("https://web.whatsapp.com/send");
    if (phone) {
      desktopUrl.searchParams.set("phone", phone);
    }
    if (text) {
      desktopUrl.searchParams.set("text", text);
    }

    return desktopUrl.toString();
  } catch {
    return rawUrl;
  }
}

export function prepareWhatsAppOpen(): PreparedWhatsAppOpen | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (isMobileClient()) {
    return { isMobile: true, popup: null };
  }

  const popup = window.open("", "_blank");
  return { isMobile: false, popup };
}

export function closePreparedWhatsAppOpen(prepared: PreparedWhatsAppOpen | null | undefined) {
  if (!prepared || prepared.isMobile) {
    return;
  }
  if (prepared.popup && !prepared.popup.closed) {
    prepared.popup.close();
  }
}

export function openWhatsAppUrl(url: string, prepared?: PreparedWhatsAppOpen | null): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const isMobile = prepared?.isMobile ?? isMobileClient();
  const targetUrl = isMobile ? url : buildDesktopWhatsappUrl(url);
  const now = Date.now();
  if (targetUrl === lastOpenedUrl && now - lastOpenedAt < WHATSAPP_OPEN_DEBOUNCE_MS) {
    return false;
  }
  lastOpenedUrl = targetUrl;
  lastOpenedAt = now;

  if (isMobile) {
    window.location.assign(targetUrl);
    return true;
  }

  if (prepared?.popup && !prepared.popup.closed) {
    try {
      prepared.popup.opener = null;
      prepared.popup.location.href = targetUrl;
      return true;
    } catch {
      prepared.popup.close();
    }
  }

  const popup = window.open(targetUrl, "_blank", "noopener,noreferrer");
  return Boolean(popup);
}
