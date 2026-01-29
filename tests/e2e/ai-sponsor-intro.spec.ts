import { test, expect, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { attachUiDiagnostics } from "./test-helpers";

type Scenario = {
  key: string;
  title: string;
  cityId: string;
  cityLabel: string;
  interestLabel: string;
  sponsorName?: string;
  sponsorTagline?: string;
  mainDisplayName: string;
  mainBioText: string;
  candidateName: string;
  candidateBioText: string;
  expectedMessageParts: RegExp[];
};

const stackName = process.env.E2E_STACK_NAME ?? "pick-backend";
const runId = Date.now().toString(36);

const scenarios: Scenario[] = [
  // Sin publicidad
  {
    key: "bogota-yoga",
    title: "intro general Yoga en Bogotá",
    cityId: "bogota",
    cityLabel: "Bogotá",
    interestLabel: "Yoga",
    mainDisplayName: "Valeria Ortiz",
    mainBioText: "Practico yoga y quiero conocer gente para compartir clases y bienestar en Bogotá.",
    candidateName: "Diego Rojas",
    candidateBioText: "Me interesa el yoga y busco compañía para clases o sesiones de bienestar en Bogotá.",
    expectedMessageParts: [/bogot[aá]/i, /yoga/i],
  },
  {
    key: "medellin-musica",
    title: "intro general Música en vivo en Medellín",
    cityId: "medellin",
    cityLabel: "Medellín",
    interestLabel: "Música en vivo",
    mainDisplayName: "Santiago Perez",
    mainBioText: "Me gusta la música en vivo y quiero conocer gente para ir a conciertos en Medellín.",
    candidateName: "Laura Rios",
    candidateBioText: "Busco compañía para planes de música en vivo en Medellín y disfrutar buenos shows.",
    expectedMessageParts: [/medell[ií]n/i, /m[uú]sica/i],
  },
  {
    key: "cali-senderismo",
    title: "intro general Senderismo en Cali",
    cityId: "cali",
    cityLabel: "Cali",
    interestLabel: "Senderismo",
    mainDisplayName: "Camila Torres",
    mainBioText: "Me gusta el senderismo y quiero conocer gente para salir a caminar en Cali.",
    candidateName: "Andres Gomez",
    candidateBioText: "Me interesa el senderismo y busco compañía para caminatas en Cali los fines de semana.",
    expectedMessageParts: [/cali/i, /senderismo/i],
  },
  {
    key: "cartagena-foto",
    title: "intro general Fotografía en Cartagena",
    cityId: "cartagena",
    cityLabel: "Cartagena",
    interestLabel: "Fotografía",
    mainDisplayName: "Mariana Ruiz",
    mainBioText: "Me encanta la fotografía y quiero conocer gente para hacer salidas fotográficas en Cartagena.",
    candidateName: "Felipe Diaz",
    candidateBioText: "Busco planes de fotografía en Cartagena y buena conversación mientras tomamos fotos.",
    expectedMessageParts: [/cartagena/i, /fotograf/i],
  },
  {
    key: "barranquilla-lectura",
    title: "intro general Lectura en Barranquilla",
    cityId: "barranquilla",
    cityLabel: "Barranquilla",
    interestLabel: "Lectura",
    mainDisplayName: "Nicolas Pardo",
    mainBioText: "Me gusta la lectura y quiero conocer gente para compartir libros en Barranquilla.",
    candidateName: "Juliana Mejia",
    candidateBioText: "Me interesa la lectura y busco compañía para planes tranquilos en Barranquilla.",
    expectedMessageParts: [/barranquilla/i, /lectura/i],
  },
  {
    key: "bucaramanga-teatro",
    title: "intro general Teatro en Bucaramanga",
    cityId: "bucaramanga",
    cityLabel: "Bucaramanga",
    interestLabel: "Teatro",
    mainDisplayName: "Daniela Castro",
    mainBioText: "Me gusta el teatro y quiero conocer gente para ir a funciones en Bucaramanga.",
    candidateName: "Jorge Rivera",
    candidateBioText: "Busco planes de teatro en Bucaramanga y buena conversación después de la función.",
    expectedMessageParts: [/bucaramanga/i, /teatro/i],
  },
  {
    key: "pereira-bici",
    title: "intro general Ciclismo en Pereira",
    cityId: "pereira",
    cityLabel: "Pereira",
    interestLabel: "Ciclismo",
    mainDisplayName: "Natalia Mendez",
    mainBioText: "Me gusta el ciclismo y quiero conocer gente para salir en bici en Pereira.",
    candidateName: "Sebastian Mora",
    candidateBioText: "Busco planes de ciclismo en Pereira para rodar y compartir rutas.",
    expectedMessageParts: [/pereira/i, /ciclismo|bici/i],
  },
  {
    key: "manizales-arte",
    title: "intro general Arte en Manizales",
    cityId: "manizales",
    cityLabel: "Manizales",
    interestLabel: "Arte",
    mainDisplayName: "Paula Andrade",
    mainBioText: "Me encanta el arte y quiero conocer gente para ir a galerías en Manizales.",
    candidateName: "Carlos Duque",
    candidateBioText: "Busco planes de arte en Manizales y espacios culturales para conversar.",
    expectedMessageParts: [/manizales/i, /arte/i],
  },
  {
    key: "santa-marta-playa",
    title: "intro general Playa en Santa Marta",
    cityId: "santa_marta",
    cityLabel: "Santa Marta",
    interestLabel: "Playa",
    mainDisplayName: "Lucia Vega",
    mainBioText: "Me encanta la playa y quiero conocer gente para planes tranquilos en Santa Marta.",
    candidateName: "Mateo Alvarez",
    candidateBioText: "Busco compañía para ir a la playa en Santa Marta y desconectarnos un rato.",
    expectedMessageParts: [/santa[_\s]*marta/i, /playa/i],
  },
  {
    key: "villavicencio-running",
    title: "intro general Running en Villavicencio",
    cityId: "villavicencio",
    cityLabel: "Villavicencio",
    interestLabel: "Running",
    mainDisplayName: "Julieta Salas",
    mainBioText: "Me gusta salir a correr y quiero conocer gente para hacer running en Villavicencio.",
    candidateName: "David Rojas",
    candidateBioText: "Busco compañía para salir a trotar en Villavicencio y hacer rutas nuevas.",
    expectedMessageParts: [/villavicencio/i, /running|correr|trotar/i],
  },
  // Con publicidad
  {
    key: "bogota-cafe",
    title: "intro con promo Juan Valdez en Bogotá",
    cityId: "bogota",
    cityLabel: "Bogotá",
    interestLabel: "Café",
    sponsorName: "Juan Valdez",
    sponsorTagline: "Latte 2x1",
    mainDisplayName: "Valeria Ortiz",
    mainBioText: "Me encanta el café y quiero conocer gente para probar lugares en Bogotá.",
    candidateName: "Diego Rojas",
    candidateBioText: "Amo el café y busco compañía para cafetear en Bogotá cuando pueda.",
    expectedMessageParts: [/bogot[aá]/i, /caf[eé]/i, /juan valdez/i, /2x1/i],
  },
  {
    key: "medellin-brunch",
    title: "intro con promo Crepes & Waffles en Medellín",
    cityId: "medellin",
    cityLabel: "Medellín",
    interestLabel: "Brunch",
    sponsorName: "Crepes & Waffles",
    sponsorTagline: "20% en brunch",
    mainDisplayName: "Sofia Lozano",
    mainBioText: "Me encanta el brunch y quiero conocer gente para probar lugares en Medellín.",
    candidateName: "Mario Ruiz",
    candidateBioText: "Busco planes de brunch en Medellín y buena conversación los fines de semana.",
    expectedMessageParts: [/medell[ií]n/i, /brunch/i, /crepes\s*&\s*waffles/i, /20%/i],
  },
  {
    key: "cali-cine",
    title: "intro con promo Cinecolombia en Cali",
    cityId: "cali",
    cityLabel: "Cali",
    interestLabel: "Cine",
    sponsorName: "Cinecolombia",
    sponsorTagline: "2*1 en Cinecolombia",
    mainDisplayName: "Camila Torres",
    mainBioText: "Me gusta el cine y quiero conocer gente para ir a funciones en Cali con buen plan.",
    candidateName: "Andres Gomez",
    candidateBioText: "Fan del cine, busco compañía para ir a funciones en Cali y comentar las pelis.",
    expectedMessageParts: [/cali/i, /cine/i, /cinecolombia/i, /2\*1/i],
  },
  {
    key: "cartagena-burger",
    title: "intro con promo El Corral en Cartagena",
    cityId: "cartagena",
    cityLabel: "Cartagena",
    interestLabel: "Hamburguesas",
    sponsorName: "El Corral",
    sponsorTagline: "15% en combo",
    mainDisplayName: "Mariana Ruiz",
    mainBioText: "Soy fan de las hamburguesas y quiero conocer gente para comer algo en Cartagena.",
    candidateName: "Felipe Diaz",
    candidateBioText: "Me encantan las hamburguesas y busco compañía para probar combos en Cartagena.",
    expectedMessageParts: [/cartagena/i, /hamburguesas/i, /el\s+corral/i, /15%/i],
  },
  {
    key: "barranquilla-pizza",
    title: "intro con promo Domino's en Barranquilla",
    cityId: "barranquilla",
    cityLabel: "Barranquilla",
    interestLabel: "Pizza",
    sponsorName: "Domino's",
    sponsorTagline: "2x1 en pizza",
    mainDisplayName: "Nicolas Pardo",
    mainBioText: "Me gusta la pizza y quiero conocer gente para comer algo en Barranquilla.",
    candidateName: "Juliana Mejia",
    candidateBioText: "Busco compañía para planes de pizza en Barranquilla y probar nuevos sabores.",
    expectedMessageParts: [/barranquilla/i, /pizza/i, /domino'?s/i, /2x1/i],
  },
  {
    key: "bucaramanga-tacos",
    title: "intro con promo El Carnal en Bucaramanga",
    cityId: "bucaramanga",
    cityLabel: "Bucaramanga",
    interestLabel: "Tacos",
    sponsorName: "El Carnal",
    sponsorTagline: "2x1 en tacos",
    mainDisplayName: "Daniela Castro",
    mainBioText:
      "Me encantan los tacos y quiero conocer gente para comer algo en Bucaramanga con buen ambiente.",
    candidateName: "Jorge Rivera",
    candidateBioText:
      "Busco planes de tacos en Bucaramanga y buena conversación para compartir algo rico.",
    expectedMessageParts: [/bucaramanga/i, /tacos/i, /el\s+carnal/i, /2x1/i],
  },
  {
    key: "pereira-sushi",
    title: "intro con promo Sushi Market en Pereira",
    cityId: "pereira",
    cityLabel: "Pereira",
    interestLabel: "Sushi",
    sponsorName: "Sushi Market",
    sponsorTagline: "15% en sushi",
    mainDisplayName: "Natalia Mendez",
    mainBioText: "Me gusta el sushi y quiero conocer gente para comer algo en Pereira.",
    candidateName: "Sebastian Mora",
    candidateBioText: "Busco planes de sushi en Pereira y compartir una buena comida.",
    expectedMessageParts: [/pereira/i, /sushi/i, /sushi\s+market/i, /15%/i],
  },
  {
    key: "manizales-helado",
    title: "intro con promo Mimo's en Manizales",
    cityId: "manizales",
    cityLabel: "Manizales",
    interestLabel: "Helados",
    sponsorName: "Mimo's",
    sponsorTagline: "2x1 en helados",
    mainDisplayName: "Paula Andrade",
    mainBioText: "Me encantan los helados y quiero conocer gente para comer algo en Manizales.",
    candidateName: "Carlos Duque",
    candidateBioText: "Busco planes de helados en Manizales para compartir un buen postre.",
    expectedMessageParts: [/manizales/i, /helad/i, /mimo'?s/i, /2x1/i],
  },
  {
    key: "santa-marta-arepa",
    title: "intro con promo Arepas Donde Lucho en Santa Marta",
    cityId: "santa_marta",
    cityLabel: "Santa Marta",
    interestLabel: "Arepas",
    sponsorName: "Arepas Donde Lucho",
    sponsorTagline: "20% en arepas",
    mainDisplayName: "Lucia Vega",
    mainBioText:
      "Me gustan las arepas y quiero conocer gente para comer algo en Santa Marta y conversar.",
    candidateName: "Mateo Alvarez",
    candidateBioText:
      "Busco planes de arepas en Santa Marta y buena conversación para pasarla bien.",
    expectedMessageParts: [/santa[_\s]*marta/i, /arepas/i, /donde\s+lucho/i, /20%/i],
  },
  {
    key: "villavicencio-cafe",
    title: "intro con promo Oma en Villavicencio",
    cityId: "villavicencio",
    cityLabel: "Villavicencio",
    interestLabel: "Café",
    sponsorName: "Oma",
    sponsorTagline: "Cappuccino 2x1",
    mainDisplayName: "Julieta Salas",
    mainBioText:
      "Me encanta el café y quiero conocer gente para cafetear en Villavicencio con calma.",
    candidateName: "David Rojas",
    candidateBioText:
      "Busco planes de café en Villavicencio y buena conversación para compartir ideas.",
    expectedMessageParts: [/villavicencio/i, /caf[eé]/i, /oma/i, /2x1/i],
  },
];

const password = "PickE2E123!";

const photoBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  "base64",
);

let apiUrl = "";
let mongoUri = "";

const createdEmails = new Set<string>();
const createdUserIds = new Set<string>();
const createdSponsorNames = new Set<string>();
const createdInterestIds = new Set<string>();

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

function runMongoScript(script: string, inherit = false) {
  return execFileSync("mongosh", [mongoUri, "--quiet", "--eval", script], {
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });
}

function createApprovedInterest(label: string): string {
  const now = new Date().toISOString();
  const script = `
const label = ${JSON.stringify(label)};
const now = ${JSON.stringify(now)};
const runId = ${JSON.stringify(runId)};
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function slugify(text) {
  const normalized = normalizeText(text);
  return normalized ? normalized.replace(/\s+/g, "_") : "interest";
}
const existing = db.interests.findOne({ label });
if (existing) {
  db.interests.updateOne({ _id: existing._id }, { $set: { status: "approved", reviewedAt: now, updatedAt: now } });
  print(JSON.stringify({ id: existing.id }));
} else {
  const normalizedLabel = normalizeText(label);
  const baseSlug = slugify(label);
  const id = baseSlug + "-" + runId;
  db.interests.insertOne({
    id,
    label,
    normalizedLabel,
    aliases: [normalizedLabel],
    source: "user",
    status: "approved",
    createdAt: now,
    updatedAt: now,
    reviewedAt: now,
    pillar: "community",
  });
  print(JSON.stringify({ id }));
}
`;
  const output = runMongoScript(script);
  const line = output.split("\n").find((entry) => entry.trim().startsWith("{"));
  if (!line) {
    throw new Error(`No pudimos crear el interés: ${output}`);
  }
  const parsed = JSON.parse(line) as { id: string };
  return parsed.id;
}

function ensureSponsor(scenario: Scenario, interest: string) {
  if (!scenario.sponsorName) {
    return;
  }
  const script = `
const name = ${JSON.stringify(scenario.sponsorName)};
const tagline = ${scenario.sponsorTagline ? JSON.stringify(scenario.sponsorTagline) : "null"};
const interest = ${JSON.stringify(interest)};
const doc = {
  name,
  interests: [interest],
  cities: [${JSON.stringify(scenario.cityId)}],
  priority: 9999,
};
if (tagline) {
  doc.tagline = tagline;
}

db.sponsors.deleteMany({ name });
const result = db.sponsors.insertOne(doc);
print(JSON.stringify({ insertedId: result.insertedId }));
`;
  runMongoScript(script, true);
}

function clearSponsorsForScenario(scenario: Scenario, interestId: string) {
  const script = `
const cityId = ${JSON.stringify(scenario.cityId)};
const interestId = ${JSON.stringify(interestId)};
db.sponsors.deleteMany({
  $or: [
    { cities: cityId },
    { interests: interestId }
  ]
});
`;
  runMongoScript(script, false);
}

async function signUpAndConfirm(
  page: Page,
  input: { email: string; displayName: string },
) {
  const { email, displayName } = input;
  await page.goto("/es/auth/sign-up");
  await page.getByLabel(/nombre/i).fill(displayName);
  await page.getByLabel(/correo/i).fill(email);
  await page.getByLabel(/contrase/i).fill(password);
  await page.getByRole("checkbox", { name: /Confirmo/i }).check();
  await page.getByRole("checkbox", { name: /Acepto|Contrato/i }).check();
  await page.getByRole("button", { name: /crear cuenta/i }).click();

  await page.waitForURL(/\/auth\/confirm/);
  await page.waitForFunction(() => {
    return Boolean(window.sessionStorage.getItem("pick:pending-signup"));
  });

  await page.getByLabel(/confirm/i).fill("000000");
  const [confirmResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.url().includes("/auth/confirm") &&
      response.request().method() === "POST",
    ),
    page.getByRole("button", { name: /confirmar cuenta/i }).click(),
  ]);

  if (!confirmResponse.ok()) {
    const body = await confirmResponse.text();
    throw new Error(`Confirmación fallida: ${body}`);
  }

  await page.waitForURL(/\/profile/);
  const userId = await page.evaluate(() => window.localStorage.getItem("pick:userId"));
  if (!userId) {
    throw new Error("No se guardó el userId en localStorage después del login.");
  }
  return userId;
}

async function saveProfileViaApi(input: {
  userId: string;
  displayName: string;
  bioText: string;
  cityId: string;
  interestId: string;
}) {
  const payload = {
    cognitoId: input.userId,
    profile: {
      displayName: input.displayName,
      bio: input.bioText,
      existingPhotoUrl: "https://placehold.co/200x200/png",
    },
    cities: [input.cityId],
    interests: [input.interestId],
  };

  await fetchJson(`${apiUrl}/profiles`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function completeProfile(
  page: Page,
  input: { bioText: string; interestLabel: string; cityLabel: string; userId: string; displayName: string; cityId: string; interestId: string },
) {
  const { bioText, interestLabel, cityLabel, userId, displayName, cityId, interestId } = input;
  await page.getByLabel(/^Bio$/i).fill(bioText);

  await page.locator('input[type="file"]').first().setInputFiles({
    name: "e2e.png",
    mimeType: "image/png",
    buffer: photoBuffer,
  });

  const interestInput = page.getByRole("combobox", { name: /Buscar intereses/i });
  await interestInput.click();
  await interestInput.fill(interestLabel);

  const searchResponse = await page.waitForResponse((response) =>
    response.url().includes("/interests/search") &&
    response.request().method() === "GET",
  );
  expect(searchResponse.ok()).toBeTruthy();

  const interestRegex = new RegExp(escapeRegExp(interestLabel), "i");
  await page.getByRole("option", { name: interestRegex }).first().click();

  const cityInput = page.getByLabel(/Ciudades/i);
  const citySearch = cityLabel.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  await cityInput.fill(citySearch);
  const cityRegex = buildAccentInsensitiveRegex(cityLabel);
  await page.getByRole("option", { name: cityRegex }).click();

  await saveProfileViaApi({
    userId,
    displayName,
    bioText,
    cityId,
    interestId,
  });

  await page.evaluate(() => {
    window.localStorage.setItem("pick:profileComplete", "true");
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAccentInsensitiveRegex(value: string): RegExp {
  const base = value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const map: Record<string, string> = {
    a: "aá",
    e: "eé",
    i: "ií",
    o: "oó",
    u: "uú",
    n: "nñ",
  };
  const pattern = base
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      if (map[lower]) {
        const variants = map[lower];
        return `[${variants}${variants.toUpperCase()}]`;
      }
      return escapeRegExp(char);
    })
    .join("");
  return new RegExp(pattern, "i");
}

function cleanupMongo() {
  if (!mongoUri) {
    return;
  }
  const script = `
const emails = ${JSON.stringify(Array.from(createdEmails))};
const userIds = ${JSON.stringify(Array.from(createdUserIds))};
const sponsorNames = ${JSON.stringify(Array.from(createdSponsorNames))};
const interestIds = ${JSON.stringify(Array.from(createdInterestIds))};
let users = 0;
let consents = 0;
let sponsors = 0;
let interests = 0;
if (userIds.length) {
  users = db.users.deleteMany({ cognitoId: { $in: userIds } }).deletedCount;
}
if (emails.length) {
  consents = db.consents.deleteMany({ email: { $in: emails } }).deletedCount;
}
if (sponsorNames.length) {
  sponsors = db.sponsors.deleteMany({ name: { $in: sponsorNames } }).deletedCount;
}
if (interestIds.length) {
  interests = db.interests.deleteMany({ id: { $in: interestIds } }).deletedCount;
}
printjson({ users, consents, sponsors, interests });
`;
  runMongoScript(script, true);
}

test.beforeAll(() => {
  apiUrl = resolveApiUrl();
  mongoUri = resolveMongoUri();
});

test.beforeEach(({ page }) => {
  attachUiDiagnostics(page);
});

test.afterAll(() => {
  cleanupMongo();
});

for (const scenario of scenarios) {
  test(scenario.title, async ({ page, browser }) => {
    const interestId = createApprovedInterest(scenario.interestLabel);
    createdInterestIds.add(interestId);

    clearSponsorsForScenario(scenario, interestId);
    ensureSponsor(scenario, interestId);
    if (scenario.sponsorName) {
      createdSponsorNames.add(scenario.sponsorName);
    }

    const mainEmail = `pick.e2e.${scenario.key}.main.${runId}@example.com`;
    const candidateEmail = `pick.e2e.${scenario.key}.candidate.${runId}@example.com`;
    createdEmails.add(mainEmail);
    createdEmails.add(candidateEmail);

    const mainUserId = await signUpAndConfirm(page, {
      email: mainEmail,
      displayName: scenario.mainDisplayName,
    });
    createdUserIds.add(mainUserId);

    await completeProfile(page, {
      bioText: scenario.mainBioText,
      interestLabel: scenario.interestLabel,
      cityLabel: scenario.cityLabel,
      userId: mainUserId,
      displayName: scenario.mainDisplayName,
      cityId: scenario.cityId,
      interestId,
    });

    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    attachUiDiagnostics(secondPage);

    let candidateUserId: string | null = null;

    try {
      candidateUserId = await signUpAndConfirm(secondPage, {
        email: candidateEmail,
        displayName: scenario.candidateName,
      });
      createdUserIds.add(candidateUserId);

      await completeProfile(secondPage, {
        bioText: scenario.candidateBioText,
        interestLabel: scenario.interestLabel,
        cityLabel: scenario.cityLabel,
        userId: candidateUserId,
        displayName: scenario.candidateName,
        cityId: scenario.cityId,
        interestId,
      });
    } finally {
      await secondContext.close();
    }

    if (!candidateUserId) {
      throw new Error("No se pudo obtener el userId del candidato.");
    }

    await page.reload();
    const matchCard = page.getByTestId(`match-card-${candidateUserId}`);
    await expect(matchCard).toBeVisible({ timeout: 30_000 });

    const [introResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/matches/intro") &&
          response.request().method() === "POST",
        { timeout: 120_000 },
      ),
      matchCard.getByRole("button", { name: /Abrir en WhatsApp/i }).click(),
    ]);

    if (!introResponse.ok()) {
      const body = await introResponse.text();
      throw new Error(`Intro fallida: ${body}`);
    }

    const introPayload = (await introResponse.json()) as {
      message?: string;
      sponsor?: { name?: string; tagline?: string };
    };

    const message = introPayload.message ?? "";
    console.log(`[e2e] WhatsApp intro (${scenario.key}):`, message);
    if (introPayload.sponsor?.name || introPayload.sponsor?.tagline) {
      console.log(`[e2e] Sponsor (${scenario.key}):`, introPayload.sponsor);
    }

    for (const pattern of scenario.expectedMessageParts) {
      expect(message).toMatch(pattern);
    }

    if (scenario.sponsorName) {
      const sponsorRegex = new RegExp(escapeRegExp(scenario.sponsorName), "i");
      expect(introPayload.sponsor?.name ?? "").toMatch(sponsorRegex);
    } else {
      expect(introPayload.sponsor).toBeUndefined();
    }
  });
}
