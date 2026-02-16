import { expect, test } from "@playwright/test";
import { attachUiDiagnostics } from "../test-helpers";

const TERMS_VERSION = "2026-02-privacy-v3";
const API_URL = process.env.E2E_API_URL ?? "http://localhost:4000";

test.beforeEach(({ page }) => {
  attachUiDiagnostics(page);
});

function buildRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

test("signup + confirm + login stores auth session", async ({ page }) => {
  const runId = buildRunId();
  const email = `pick.local.signup.${runId}@example.com`;
  const password = "PickE2E123!";
  const displayName = `Pick Local ${runId}`;

  await page.goto("/es/auth/sign-up");
  await page.getByLabel(/nombre visible/i).fill(displayName);
  await page.getByLabel(/correo electr[oó]nico/i).fill(email);
  await page.getByLabel(/contrase/i).fill(password);

  await page.getByLabel(/confirmo que soy mayor de edad/i).check();
  await page.getByLabel(/autorizo el tratamiento de mis datos personales/i).check();

  await page.getByRole("button", { name: /crear cuenta/i }).click();
  await expect(page).toHaveURL(/\/es\/auth\/confirm\/?\?email=/);

  await page.getByLabel(/c[oó]digo de confirmaci[oó]n/i).fill("000000");
  await page.getByRole("button", { name: /confirmar cuenta/i }).click();
  const redirectedToSignIn = await page
    .waitForURL(/\/es\/auth\/sign-in\/?\?email=/, { timeout: 6_000 })
    .then(() => true)
    .catch(() => false);

  if (!redirectedToSignIn) {
    await expect(page.getByText(/c[oó]digo ingresado no es v[aá]lido|ya estaba confirmada/i)).toBeVisible();
    await page.goto(`/es/auth/sign-in?email=${encodeURIComponent(email)}`);
  }

  await page.getByLabel(/correo electr[oó]nico/i).fill(email);
  await page.getByLabel(/contrase/i).fill(password);
  await page.getByRole("button", { name: /iniciar sesi[oó]n/i }).click();

  await expect(page).toHaveURL(/\/es\/profile/);

  const session = await page.evaluate(() => ({
    userId: window.localStorage.getItem("pick:userId"),
    idToken: window.localStorage.getItem("pick:idToken"),
    accessToken: window.localStorage.getItem("pick:accessToken"),
  }));

  expect(session.userId).toBeTruthy();
  expect(session.idToken || session.accessToken).toBeTruthy();
});

test("password recovery request and reset validation flow", async ({ page, request }) => {
  const runId = buildRunId();
  const email = `pick.local.recover.${runId}@example.com`;
  const password = "PickE2E123!";

  const registerResponse = await request.post(`${API_URL}/auth/register`, {
    data: {
      email,
      password,
      displayName: `Recovery ${runId}`,
      ageConfirmed: true,
      acceptTerms: true,
      termsVersion: TERMS_VERSION,
      locale: "es",
    },
  });
  expect(registerResponse.ok()).toBeTruthy();

  await page.goto("/es/auth/recover");
  await page.getByLabel(/correo asociado a tu cuenta/i).fill(email);
  await page.getByRole("button", { name: /enviar c[oó]digo/i }).click();

  await expect(page.getByText(/te enviaremos un c[oó]digo de recuperaci[oó]n/i)).toBeVisible();

  await page.getByLabel(/c[oó]digo de recuperaci[oó]n/i).fill("111111");
  await page.getByLabel(/nueva contrase/i).fill("NuevaClave123!");
  await page.getByRole("button", { name: /actualizar contrase/i }).click();

  await expect(page.getByText(/c[oó]digo ingresado no es v[aá]lido/i)).toBeVisible();
});
