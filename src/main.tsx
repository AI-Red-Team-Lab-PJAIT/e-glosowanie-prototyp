import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loguj, startDziennika } from "./debug/dziennik";
import { router } from "./router";
import { StanProvider } from "./state/StanProvider";
import "devices.css/dist/devices.min.css";
import "./styles.css";

startDziennika();
router.subscribe("onResolved", (e) =>
	loguj("ekran", { z: e.fromLocation?.pathname, do: e.toLocation.pathname }),
);

const el = document.getElementById("root");
if (el) {
	createRoot(el).render(
		<StrictMode>
			<StanProvider>
				<RouterProvider router={router} />
			</StanProvider>
		</StrictMode>,
	);
}
