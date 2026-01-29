import { test, expect, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { attachUiDiagnostics } from "./test-helpers";

const stackName = process.env.E2E_STACK_NAME ?? "pick-backend";
const runId = Date.now().toString(36);
const customInterestLabel = `Custom E2E ${runId}`;
const password = "PickE2E123!";
const cityLabel = "Cali";
const displayNameA = `E2E Custom A ${runId}`;
const displayNameB = `E2E Custom B ${runId}`;
const bioTextA =
  "Estoy probando un flujo completo con un interés personalizado para validar aprobación manual.";
const bioTextB =
  "Necesitamos confirmar que los intereses personalizados aprobados generan matches reales.";

const photoBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  "base64",
);

let userPoolId = "";
let mongoUri = "";
let testEmailA = "";
let testEmailB = "";
let testUserIdA: string | null = null;
let testUserIdB: string | null = null;

function runAws(args: string[]): string {
  return execFileSync("aws", args, { encoding: "utf8" }).trim();
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

async function adminConfirmUser(email: string) {
  const args = [
    "cognito-idp",
    "admin-confirm-sign-up",
    "--user-pool-id",
    userPoolId,
    "--username",
    email,
  ];

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      runAws(args);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("UserNotFoundException") || attempt === 5) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }
  }
}

function adminDeleteUser(email: string) {
  try {
    runAws([
      "cognito-idp",
      "admin-delete-user",
      "--user-pool-id",
      userPoolId,
      "--username",
      email,
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UserNotFoundException")) {
      return;
    }
    throw error;
  }
}

function parseMongoOutput(output: string): { found: boolean; status: string | null } {
  const lines = output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const line = [...lines].reverse().find((entry) => entry.startsWith("{"));
  if (!line) {
    throw new Error(`No pudimos leer el resultado de Mongo: ${output}`);
  }
  return JSON.parse(line) as { found: boolean; status: string | null };
}

function queryInterestStatus(label: string): { found: boolean; status: string | null } {
  if (!mongoUri) {
    throw new Error("MongoDbUri no está configurado.");
  }
  const script = `
const label = ${JSON.stringify(label)};
const doc = db.interests.findOne({ label }, { status: 1 });
print(JSON.stringify({ found: Boolean(doc), status: doc ? doc.status : null }));
`;

  const output = execFileSync("mongosh", [mongoUri, "--quiet", "--eval", script], {
    encoding: "utf8",
  });

  return parseMongoOutput(output);
}

function approveInterest(label: string) {
  if (!mongoUri) {
    throw new Error("MongoDbUri no está configurado.");
  }
  const now = new Date().toISOString();
  const script = `
const label = ${JSON.stringify(label)};
const now = ${JSON.stringify(now)};
const result = db.interests.updateOne(
  { label },
  { $set: { status: "approved", reviewedAt: now, updatedAt: now } }
);
print(JSON.stringify({ matched: result.matchedCount, modified: result.modifiedCount }));
`;

  const output = execFileSync("mongosh", [mongoUri, "--quiet", "--eval", script], {
    encoding: "utf8",
  });
  const lines = output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const line = [...lines].reverse().find((entry) => entry.startsWith("{"));
  if (!line) {
    throw new Error(`No pudimos leer el resultado de Mongo: ${output}`);
  }
  return JSON.parse(line) as { matched: number; modified: number };
}

async function signUpAndConfirm(page: Page, email: string, displayName: string): Promise<string> {
  await page.goto("/es/auth/sign-up");
  await page.getByLabel(/nombre/i).fill(displayName);
  await page.getByLabel(/correo/i).fill(email);
  await page.getByLabel(/contrase/i).fill(password);
  await page.getByRole("checkbox", { name: /Confirmo/i }).check();
  await page.getByRole("checkbox", { name: /Acepto|Contrato/i }).check();
  await page.getByRole("button", { name: /crear cuenta/i }).click();

  await page.waitForURL(/\/auth\/confirm/);
  await adminConfirmUser(email);

  await page.getByLabel(/confirm/i).fill("000000");
  await page.getByRole("button", { name: /confirmar cuenta/i }).click();

  await page.waitForURL(/\/profile/);
  const userId = await page.evaluate(() => window.localStorage.getItem("pick:userId"));
  if (!userId) {
    throw new Error("No pudimos leer pick:userId después del login.");
  }
  return userId;
}

async function completeProfile(
  page: Page,
  options: {
    interestLabel: string;
    bioText: string;
    expectCreated: boolean;
    expectPendingNotice: boolean;
  },
) {
  await page.getByLabel(/^Bio$/i).fill(options.bioText);

  await page.locator('input[type="file"]').first().setInputFiles({
    name: "e2e.png",
    mimeType: "image/png",
    buffer: photoBuffer,
  });

  const interestInput = page.getByLabel(/Buscar intereses/i);
  await interestInput.click();
  await interestInput.fill(options.interestLabel);

  const [resolveResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.url().includes("/interests/resolve") &&
      response.request().method() === "POST",
    ),
    page.keyboard.press("Enter"),
  ]);

  expect(resolveResponse.ok()).toBeTruthy();
  const resolved = (await resolveResponse.json()) as { created?: boolean; label?: string };
  expect(resolved.created).toBe(options.expectCreated);
  expect(resolved.label).toBe(options.interestLabel);

  await expect(page.getByText(options.interestLabel, { exact: true })).toBeVisible();

  if (options.expectPendingNotice) {
    await expect(
      page.getByText(/Ingresaste un interés personalizado/i),
    ).toBeVisible();
  } else {
    await expect(
      page.getByText(/Ingresaste un interés personalizado/i),
    ).toHaveCount(0);
  }

  const cityInput = page.getByLabel(/Ciudades/i);
  await cityInput.fill(cityLabel);
  await page.getByRole("option", { name: new RegExp(cityLabel, "i") }).click();

  await page.getByRole("button", { name: /guardar perfil/i }).click();
  await expect(page.getByText(/Perfil guardado/i)).toBeVisible();
}

function cleanupMongo() {
  const cognitoIds = [testUserIdA, testUserIdB].filter(Boolean) as string[];
  const emails = [testEmailA, testEmailB].filter(Boolean) as string[];
  const interestLabels = [customInterestLabel];

  if (!mongoUri || (!cognitoIds.length && !emails.length && !interestLabels.length)) {
    return;
  }

  const script = `
const cognitoIds = ${JSON.stringify(cognitoIds)};
const emails = ${JSON.stringify(emails)};
const interestLabels = ${JSON.stringify(interestLabels)};
let users = 0;
let consents = 0;
let interests = 0;
if (cognitoIds.length) {
  users = db.users.deleteMany({ cognitoId: { $in: cognitoIds } }).deletedCount;
}
if (emails.length) {
  consents = db.consents.deleteMany({ email: { $in: emails } }).deletedCount;
}
if (interestLabels.length) {
  interests = db.interests.deleteMany({ label: { $in: interestLabels } }).deletedCount;
}
printjson({ users, consents, interests });
`;

  execFileSync("mongosh", [mongoUri, "--quiet", "--eval", script], {
    stdio: "inherit",
  });
}

test.beforeAll(() => {
  userPoolId = resolveUserPoolId();
  mongoUri = resolveMongoUri();
});

test.beforeEach(({ page }) => {
  attachUiDiagnostics(page);
});

test.afterAll(() => {
  if (testEmailA && userPoolId) {
    adminDeleteUser(testEmailA);
  }
  if (testEmailB && userPoolId) {
    adminDeleteUser(testEmailB);
  }
  cleanupMongo();
});

test("custom interest approval enables matches", async ({ page, browser }) => {
  testEmailA = `pick.e2e.custom.a.${runId}@example.com`;
  testEmailB = `pick.e2e.custom.b.${runId}@example.com`;

  testUserIdA = await signUpAndConfirm(page, testEmailA, displayNameA);

  await completeProfile(page, {
    interestLabel: customInterestLabel,
    bioText: bioTextA,
    expectCreated: true,
    expectPendingNotice: true,
  });

  const pendingStatus = queryInterestStatus(customInterestLabel);
  expect(pendingStatus.found).toBe(true);
  expect(pendingStatus.status).toBe("pending");

  const approval = approveInterest(customInterestLabel);
  expect(approval.matched).toBe(1);

  const approvedStatus = queryInterestStatus(customInterestLabel);
  expect(approvedStatus.status).toBe("approved");

  const secondContext = await browser.newContext();
  const secondPage = await secondContext.newPage();
  attachUiDiagnostics(secondPage);

  try {
    testUserIdB = await signUpAndConfirm(secondPage, testEmailB, displayNameB);

    await completeProfile(secondPage, {
      interestLabel: customInterestLabel,
      bioText: bioTextB,
      expectCreated: false,
      expectPendingNotice: false,
    });

    await expect(secondPage.getByText(displayNameA)).toBeVisible({
      timeout: 30_000,
    });

    await page.reload();
    await expect(page.getByText(displayNameB)).toBeVisible({
      timeout: 30_000,
    });
  } finally {
    await secondContext.close();
  }
});
