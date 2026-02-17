import { expect, test } from "@playwright/test";
import { attachUiDiagnostics } from "../test-helpers";

const API_URL = process.env.E2E_API_URL ?? "http://localhost:4000";

function buildRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function fetchJson(
  request: Parameters<typeof test>[0]["request"],
  url: string,
  init?: Parameters<Parameters<typeof test>[0]["request"]["fetch"]>[1],
) {
  const response = await request.fetch(url, init);
  if (!response.ok()) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status()}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

test.beforeEach(async ({ page }) => {
  attachUiDiagnostics(page);
  await page.addInitScript(() => {
    const store = window as Window & {
      __pickOpenCalls: Array<{
        url: string;
        target: string;
        features: string;
        assignedUrl: string;
      }>;
    };

    store.__pickOpenCalls = [];
    window.open = ((url?: string | URL, target?: string, features?: string) => {
      const call = {
        url: typeof url === "string" ? url : url ? url.toString() : "",
        target: typeof target === "string" ? target : "",
        features: typeof features === "string" ? features : "",
        assignedUrl: "",
      };
      store.__pickOpenCalls.push(call);

      const popup = {
        closed: false,
        opener: window,
        location: {} as { href: string },
        close() {
          this.closed = true;
        },
      };

      Object.defineProperty(popup.location, "href", {
        get() {
          return call.assignedUrl;
        },
        set(value: string) {
          call.assignedUrl = String(value);
        },
        configurable: true,
      });

      return popup as unknown as Window;
    }) as typeof window.open;
  });
});

test("open in WhatsApp targets web.whatsapp.com with a direct phone number", async ({
  page,
  request,
}) => {
  const runId = buildRunId();
  const email = `pick.local.whatsapp.${runId}@example.com`;
  const password = "PickE2E123!";
  const displayName = `Pick WhatsApp ${runId}`;
  const candidatePhoneDigits = "573001112233";
  const sharedCityId = "villavicencio";

  const registerResponse = await request.post(`${API_URL}/auth/register`, {
    data: {
      email,
      password,
      displayName,
      ageConfirmed: true,
      acceptTerms: true,
      termsVersion: "2026-02-privacy-v3",
      locale: "es",
    },
  });
  expect(registerResponse.ok()).toBeTruthy();

  const interestsPayload = await fetchJson(request, `${API_URL}/interests/search`, {
    method: "GET",
  });
  const firstInterest = Array.isArray(interestsPayload.interests)
    ? (interestsPayload.interests[0] as { id?: string; label?: string })
    : undefined;
  expect(firstInterest?.id).toBeTruthy();
  expect(firstInterest?.label).toBeTruthy();

  await fetchJson(request, `${API_URL}/profiles`, {
    method: "PUT",
    data: {
      cognitoId: `pick-local-candidate-${runId}`,
      profile: {
        displayName: `Candidata WhatsApp ${runId}`,
        bio: "Perfil local para validar que abrir en WhatsApp use el numero directo del match.",
        whatsappNumber: `+${candidatePhoneDigits}`,
        existingPhotoUrl: "https://placehold.co/200x200/png",
      },
      cities: [sharedCityId],
      interests: [firstInterest?.id],
    },
  });

  await page.goto("/es/auth/sign-in");
  await page.getByLabel(/correo electr[oó]nico/i).fill(email);
  await page.getByLabel(/contrase/i).fill(password);
  await page.getByRole("button", { name: /iniciar sesi[oó]n/i }).click();
  await expect(page).toHaveURL(/\/es\/profile/);

  await page.getByLabel(/nombre visible/i).fill(displayName);
  await page.getByLabel(/^Bio$/i).fill(
    "Estoy completando mi perfil para validar que el boton de WhatsApp abra el chat correcto.",
  );
  await page.getByLabel(/Numero de WhatsApp/i).fill("3007654321");

  const photoBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "base64",
  );
  await page.locator("input[type=\"file\"]").first().setInputFiles({
    name: "e2e-whatsapp-local.png",
    mimeType: "image/png",
    buffer: photoBuffer,
  });

  const interestLabel = String(firstInterest?.label ?? "");
  const interestInput = page.getByLabel(/Buscar intereses/i);
  await interestInput.fill(interestLabel);
  await page.getByRole("option", { name: new RegExp(interestLabel, "i") }).first().click();

  const cityInput = page.getByLabel(/Ciudades/i);
  await cityInput.fill("Villavicencio");
  await page.getByRole("option", { name: /Villavicencio/i }).first().click();

  await page.getByRole("button", { name: /guardar perfil/i }).click();
  await expect(page.getByText(/perfil guardado/i)).toBeVisible();

  await expect(page.getByText(new RegExp(`Candidata WhatsApp ${runId}`, "i"))).toBeVisible({
    timeout: 30_000,
  });

  await page.getByRole("button", { name: /abrir en whatsapp/i }).first().click();

  await expect
    .poll(
      async () => page.evaluate(() => (window as Window & { __pickOpenCalls: unknown[] }).__pickOpenCalls.length),
      { timeout: 15_000 },
    )
    .toBeGreaterThan(0);

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const calls = (window as Window & {
            __pickOpenCalls: Array<{
              url: string;
              assignedUrl: string;
            }>;
          }).__pickOpenCalls;
          if (!calls.length) {
            return "";
          }
          return calls[0].assignedUrl || calls[0].url;
        }),
      { timeout: 30_000 },
    )
    .toContain("web.whatsapp.com/send");

  const calls = await page.evaluate(
    () =>
      (window as Window & {
        __pickOpenCalls: Array<{
          url: string;
          assignedUrl: string;
        }>;
      }).__pickOpenCalls,
  );

  expect(calls.length).toBe(1);
  const openedUrl = calls[0].assignedUrl || calls[0].url;

  const parsed = new URL(openedUrl);
  expect(parsed.searchParams.get("phone")).toBe(candidatePhoneDigits);
  expect(parsed.searchParams.get("text")).toBeTruthy();
  await expect(page).toHaveURL(/\/es\/profile/);
});
