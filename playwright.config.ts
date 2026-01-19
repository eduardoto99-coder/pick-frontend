import { defineConfig } from "@playwright/test";

const baseURL =
  process.env.E2E_BASE_URL ??
  "https://main.d3unp36n1bzsm.amplifyapp.com";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 180_000,
  expect: {
    timeout: 20_000,
  },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  reporter: [["list"]],
});
