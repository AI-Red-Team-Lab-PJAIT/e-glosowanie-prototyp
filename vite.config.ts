import { appendFileSync, mkdirSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

// Tylko w dev: przyjmuje zdarzenia z src/debug/dziennik.ts i dopisuje je do debug/sesja.jsonl.
function dziennikDebug(): Plugin {
	return {
		name: "dziennik-debug",
		apply: "serve",
		configureServer(server) {
			mkdirSync("debug", { recursive: true });
			server.middlewares.use("/__debug", (req, res) => {
				let body = "";
				req.on("data", (c) => {
					body += c;
				});
				req.on("end", () => {
					try {
						const zdarzenia = JSON.parse(body) as unknown[];
						appendFileSync(
							"debug/sesja.jsonl",
							zdarzenia.map((z) => JSON.stringify(z)).join("\n") + "\n",
						);
					} catch {
						res.statusCode = 400;
					}
					res.end();
				});
			});
		},
	};
}

export default defineConfig(({ command }) => ({
	// GitHub Pages serwuje repo pod /e-glosowanie-prototyp/, lokalnie zostaje /.
	base: command === "build" ? "/e-glosowanie-prototyp/" : "/",
	plugins: [react(), tailwindcss(), dziennikDebug()],
	test: {
		environment: "jsdom",
		include: ["tests/unit/**/*.test.{ts,tsx}"],
	},
}));
