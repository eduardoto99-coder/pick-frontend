import { defineConfig } from "@playwright/test";

const frontendBaseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const backendApiUrl = process.env.E2E_API_URL ?? "http://localhost:4000";
const backendDir = process.env.E2E_BACKEND_DIR ?? "../pick-backend";

export default defineConfig({
  testDir: "tests/e2e/local",
  timeout: 180_000,
  expect: {
    timeout: 20_000,
  },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: frontendBaseUrl,
    trace: "on-first-retry",
  },
  reporter: [["list"]],
  webServer: [
    {
      command: `cd ${backendDir} && PICK_API_PORT=4000 ./scripts/local-node-api.sh`,
      url: `${backendApiUrl}/health`,
      reuseExistingServer: false,
      timeout: 240_000,
    },
    {
      command: "npm run dev -- --port 3000",
      url: frontendBaseUrl,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_URL: backendApiUrl,
      },
    },
  ],
});
