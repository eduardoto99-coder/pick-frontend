const mobileUserAgentPattern = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i;

export function openWhatsAppUrl(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  const userAgent = window.navigator.userAgent ?? "";
  const isMobile = mobileUserAgentPattern.test(userAgent);

  if (isMobile) {
    window.location.assign(url);
    return;
  }

  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(url);
  }
}
