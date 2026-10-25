import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "tests/e2e",
	fullyParallel: true,
	reporter: process.env.CI ? "github" : "list",
	// Zrzuty zależą od systemu (fonty), więc trzymamy je osobno per platforma.
	snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{testFilePath}/{arg}{ext}",
	use: { baseURL: "http://localhost:5173", ...devices["iPhone 15"], browserName: "chromium" },
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:5173",
		reuseExistingServer: !process.env.CI,
	},
});
