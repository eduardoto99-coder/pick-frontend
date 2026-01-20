import type { Page } from "@playwright/test";

export function attachUiDiagnostics(page: Page) {
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    const errorText = failure?.errorText ?? "unknown";
    if (
      errorText.includes("ERR_ABORTED") ||
      errorText.includes("ERR_NETWORK_IO_SUSPENDED")
    ) {
      return;
    }
    console.error(
      `[e2e][requestfailed] ${request.method()} ${request.url()} :: ${errorText}`,
    );
  });

  page.on("response", (response) => {
    const status = response.status();
    if (status < 400) {
      return;
    }
    const url = response.url();
    if (url.includes("favicon")) {
      return;
    }
    console.error(`[e2e][response] ${status} ${response.request().method()} ${url}`);
  });

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }
    console.error(`[e2e][console] ${message.text()}`);
  });

  page.on("pageerror", (error) => {
    console.error(`[e2e][pageerror] ${error.message}`);
  });
}
