import { expect, test } from "@playwright/test";
import { attachUiDiagnostics } from "../test-helpers";

const API_URL = process.env.E2E_API_URL ?? "http://localhost:4000";

function buildRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

test.beforeEach(({ page }) => {
  attachUiDiagnostics(page);
});

test("profile save clearly shows pending required fields", async ({ page, request }) => {
  const runId = buildRunId();
  const email = `pick.local.requirements.${runId}@example.com`;
  const password = "PickE2E123!";
  const displayName = `Pick Required ${runId}`;

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

  const completionAlert = page.getByTestId("profile-completion-alert");
  await page.getByLabel(/nombre visible/i).fill("");
  await expect(completionAlert).toContainText(/te faltan 6 requisitos/i);
  await expect(page.getByTestId("profile-requirement-displayName-pending")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-bio-pending")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-photo-pending")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-whatsappNumber-pending")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-interests-pending")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-cities-pending")).toBeVisible();

  await page.getByLabel(/nombre visible/i).fill(displayName);
  await page.getByLabel(/^Bio$/i).fill(
    "Estoy completando mi perfil para verificar que Pick me explique claramente qué requisitos faltan antes de guardar.",
  );
  await page.getByLabel(/Numero de WhatsApp/i).fill("3001234567");

  const photoBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "base64",
  );
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "e2e-requirements.png",
    mimeType: "image/png",
    buffer: photoBuffer,
  });

  const interestInput = page.getByLabel(/Buscar intereses/i);
  await interestInput.fill("product");
  await page.getByRole("option", { name: /product/i }).first().click();

  const cityInput = page.getByLabel(/Ciudades/i);
  await cityInput.fill("Bogotá");
  await page.getByRole("option", { name: /Bogotá/i }).first().click();

  await expect(completionAlert).toContainText(/perfil completo/i);
  await expect(page.getByTestId("profile-requirement-displayName-done")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-bio-done")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-photo-done")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-whatsappNumber-done")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-interests-done")).toBeVisible();
  await expect(page.getByTestId("profile-requirement-cities-done")).toBeVisible();

  await page.getByRole("button", { name: /guardar perfil/i }).click();
  await expect(page.getByText(/perfil guardado/i)).toBeVisible();
});
