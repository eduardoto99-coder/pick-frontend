import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { attachUiDiagnostics } from "./test-helpers";

const stackName = process.env.E2E_STACK_NAME ?? "pick-backend";
const runId = Date.now().toString(36);
const candidateId = `e2e-candidate-${runId}`;
const candidateName = `Candidata E2E ${runId}`;

let apiUrl = "";
let userPoolId = "";
let mongoUri = "";
let interestId = "";
let interestLabel = "Product builders";
let testEmail = "";
let testUserId: string | null = null;

function runAws(args: string[]): string {
  return execFileSync("aws", args, { encoding: "utf8" }).trim();
}

function resolveApiUrl(): string {
  if (process.env.E2E_API_URL) {
    return process.env.E2E_API_URL.replace(/\/$/, "");
  }
  const output = runAws([
    "cloudformation",
    "describe-stacks",
    "--stack-name",
    stackName,
    "--query",
    "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue",
    "--output",
    "text",
  ]);
  if (!output) {
    throw new Error("No pudimos resolver ApiUrl desde CloudFormation.");
  }
  return output.replace(/\/$/, "");
}

function resolveUserPoolId(): string {
  if (process.env.E2E_USER_POOL_ID) {
    return process.env.E2E_USER_POOL_ID;
  }
  const output = runAws([
    "cloudformation",
    "describe-stacks",
    "--stack-name",
    stackName,
    "--query",
    "Stacks[0].Parameters[?ParameterKey=='CognitoUserPoolId'].ParameterValue",
    "--output",
    "text",
  ]);
  if (!output) {
    throw new Error("No pudimos resolver CognitoUserPoolId desde CloudFormation.");
  }
  return output;
}

function resolveMongoUri(): string {
  if (process.env.E2E_MONGODB_URI) {
    return process.env.E2E_MONGODB_URI;
  }
  const output = runAws([
    "cloudformation",
    "describe-stacks",
    "--stack-name",
    stackName,
    "--query",
    "Stacks[0].Parameters[?ParameterKey=='MongoDbUri'].ParameterValue",
    "--output",
    "text",
  ]);
  if (!output) {
    throw new Error("No pudimos resolver MongoDbUri desde CloudFormation.");
  }
  return output;
}

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

async function resolveInterest(label: string) {
  const payload = await fetchJson(`${apiUrl}/interests/resolve`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ label }),
  });
  return payload as { interestId: string; label: string };
}

async function seedCandidateProfile() {
  const payload = {
    cognitoId: candidateId,
    profile: {
      displayName: candidateName,
      bio: "Perfil de prueba para generar matches en el flujo E2E y validar sugerencias reales.",
      existingPhotoUrl: "https://example.com/pick-e2e.png",
      linkedinUrl: "https://www.linkedin.com/in/pick-e2e",
      instagramUrl: "https://instagram.com/pick-e2e",
    },
    cities: ["cali"],
    interests: [interestId],
  };

  await fetchJson(`${apiUrl}/profiles`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function adminConfirmUser(email: string) {
  runAws([
    "cognito-idp",
    "admin-confirm-sign-up",
    "--user-pool-id",
    userPoolId,
    "--username",
    email,
  ]);
}

function adminDeleteUser(email: string) {
  runAws([
    "cognito-idp",
    "admin-delete-user",
    "--user-pool-id",
    userPoolId,
    "--username",
    email,
  ]);
}

function cleanupMongo() {
  const cognitoIds = [candidateId, testUserId].filter(Boolean) as string[];
  const emails = testEmail ? [testEmail] : [];

  if (!mongoUri || (!cognitoIds.length && !emails.length)) {
    return;
  }

  const script = `
const cognitoIds = ${JSON.stringify(cognitoIds)};
const emails = ${JSON.stringify(emails)};
let users = 0;
let consents = 0;
if (cognitoIds.length) {
  users = db.users.deleteMany({ cognitoId: { $in: cognitoIds } }).deletedCount;
}
if (emails.length) {
  consents = db.consents.deleteMany({ email: { $in: emails } }).deletedCount;
}
printjson({ users, consents });
`;

  execFileSync("mongosh", [mongoUri, "--quiet", "--eval", script], {
    stdio: "inherit",
  });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test.beforeAll(async () => {
  apiUrl = resolveApiUrl();
  userPoolId = resolveUserPoolId();
  mongoUri = resolveMongoUri();

  const resolved = await resolveInterest(interestLabel);
  interestId = resolved.interestId;
  interestLabel = resolved.label;

  await seedCandidateProfile();
});

test.beforeEach(({ page }) => {
  attachUiDiagnostics(page);
});

test.afterAll(() => {
  if (testEmail && userPoolId) {
    adminDeleteUser(testEmail);
  }
  cleanupMongo();
});

test("signup flow ends with a match suggestion", async ({ page }) => {
  testEmail = `pick.e2e.${runId}@example.com`;
  const password = "PickE2E123!";
  const displayName = `E2E User ${runId}`;
  const bioText =
    "Estoy probando Pick con un perfil realista para validar el flujo completo de matches.";

  await page.goto("/es/auth/sign-up");
  await page.getByLabel(/nombre/i).fill(displayName);
  await page.getByLabel(/correo/i).fill(testEmail);
  await page.getByLabel(/contrase/i).fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /crear cuenta/i }).click();

  await page.waitForURL(/\/auth\/confirm/);
  adminConfirmUser(testEmail);

  await page.getByLabel(/confirm/i).fill("000000");
  await page.getByRole("button", { name: /confirmar cuenta/i }).click();

  await page.waitForURL(/\/profile/);
  testUserId = await page.evaluate(() => window.localStorage.getItem("pick:userId"));

  await page.getByLabel(/^Bio$/i).fill(bioText);
  await page.getByLabel(/LinkedIn/i).fill("https://www.linkedin.com/in/e2e-user");
  await page.getByLabel(/Instagram/i).fill("https://instagram.com/e2e-user");

  const photoBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "base64",
  );
  await page.locator("input[type=\"file\"]").first().setInputFiles({
    name: "e2e.png",
    mimeType: "image/png",
    buffer: photoBuffer,
  });

  const interestInput = page.getByLabel(/Buscar intereses/i);
  await interestInput.fill(interestLabel);
  await page.getByRole("option", { name: new RegExp(escapeRegex(interestLabel), "i") }).click();

  const cityInput = page.getByLabel(/Ciudades/i);
  await cityInput.fill("Cali");
  await page.getByRole("option", { name: /Cali/i }).click();

  await page.getByRole("button", { name: /guardar perfil/i }).click();
  await expect(page.getByText(/Perfil guardado/i)).toBeVisible();

  await page.goto("/es/matches");
  await expect(page.getByRole("heading", { name: candidateName })).toBeVisible({
    timeout: 30_000,
  });
});
