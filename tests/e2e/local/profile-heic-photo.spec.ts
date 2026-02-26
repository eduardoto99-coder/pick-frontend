import { expect, test } from "@playwright/test";
import { attachUiDiagnostics } from "../test-helpers";

const API_URL = process.env.E2E_API_URL ?? "http://localhost:4000";

function buildRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

test.beforeEach(({ page }) => {
  attachUiDiagnostics(page);
});

test("profile can be saved with an iPhone HEIC photo", async ({ page, request }) => {
  const runId = buildRunId();
  const email = `pick.local.heic.${runId}@example.com`;
  const password = "PickE2E123!";
  const displayName = `Pick HEIC ${runId}`;

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

  await page.goto("/es/auth/sign-in");
  await page.getByLabel(/correo electr[oó]nico/i).fill(email);
  await page.getByLabel(/contrase/i).fill(password);
  await page.getByRole("button", { name: /iniciar sesi[oó]n/i }).click();
  await expect(page).toHaveURL(/\/es\/profile/);

  await page.getByLabel(/nombre visible/i).fill(displayName);
  await page.getByLabel(/^Bio$/i).fill(
    "Estoy completando mi perfil con una foto HEIC para validar el flujo de guardado.",
  );
  await page.getByLabel(/Numero de WhatsApp/i).fill("3001234567");
  await page.getByLabel(/LinkedIn/i).fill("https://www.linkedin.com/in/e2e-heic");
  await page.getByLabel(/Instagram/i).fill("https://instagram.com/e2e.heic");

  const heicBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "base64",
  );
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "e2e-heic.heic",
    mimeType: "image/heic",
    buffer: heicBuffer,
  });

  const interestInput = page.getByLabel(/Buscar intereses/i);
  await interestInput.fill("product");
  await page.getByRole("option", { name: /product/i }).first().click();

  const cityInput = page.getByLabel(/Ciudades/i);
  await cityInput.fill("Bogotá");
  await page.getByRole("option", { name: /Bogotá/i }).first().click();

  await page.getByRole("button", { name: /guardar perfil/i }).click();
  await expect(page.getByText(/perfil guardado/i)).toBeVisible();
});
