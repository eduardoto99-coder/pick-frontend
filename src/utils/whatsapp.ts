const mobileUserAgentPattern = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i;
const WHATSAPP_OPEN_DEBOUNCE_MS = 1200;

let lastOpenedUrl = "";
let lastOpenedAt = 0;

function buildDesktopWhatsappUrl(rawUrl: string): string {
  try {
    const source = new URL(rawUrl);
    const isWaHost = source.hostname === "wa.me" || source.hostname === "api.whatsapp.com";
    if (!isWaHost) {
      return rawUrl;
    }

    const phoneFromPath = source.pathname.replace(/\//g, "").trim();
    const text =
      source.searchParams.get("text") ??
      source.searchParams.get("message") ??
      "";

    const desktopUrl = new URL("https://web.whatsapp.com/send");
    if (phoneFromPath) {
      desktopUrl.searchParams.set("phone", phoneFromPath);
    }
    if (text) {
      desktopUrl.searchParams.set("text", text);
    }

    return desktopUrl.toString();
  } catch {
    return rawUrl;
  }
}

export function openWhatsAppUrl(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  const now = Date.now();
  if (url === lastOpenedUrl && now - lastOpenedAt < WHATSAPP_OPEN_DEBOUNCE_MS) {
    return;
  }
  lastOpenedUrl = url;
  lastOpenedAt = now;

  const userAgent = window.navigator.userAgent ?? "";
  const isMobile = mobileUserAgentPattern.test(userAgent);
  const targetUrl = isMobile ? url : buildDesktopWhatsappUrl(url);

  if (isMobile) {
    window.location.assign(targetUrl);
    return;
  }

  const popup = window.open(targetUrl, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(targetUrl);
  }
}
