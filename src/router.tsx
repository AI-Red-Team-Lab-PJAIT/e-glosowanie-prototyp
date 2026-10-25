import {
	createHashHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Link,
} from "@tanstack/react-router";
import { OProjekcie } from "./about/OProjekcie";
import { Start } from "./shell/Start";
import { Telefon } from "./shell/Telefon";
import { Uslugi } from "./shell/Uslugi";
import {
	Dokument,
	Karta,
	Logowanie,
	Oddany,
	Potwierdzenie,
	Rodzaj,
	Tozsamosc,
	Twarz,
} from "./wybory/Glosowanie";
import { Historia, Rejestr, Szczegoly, WyboryEkran } from "./wybory/Wybory";

const root = createRootRoute({
	component: Telefon,
	notFoundComponent: () => (
		<p className="empty">
			<b>Nie ma takiego ekranu</b>
			<Link to="/uslugi" style={{ color: "var(--accent)", fontWeight: 600 }}>
				Wróć do usług
			</Link>
		</p>
	),
});

const r = (path: string, component: () => React.ReactNode) =>
	createRoute({ getParentRoute: () => root, path, component });

const oddany = createRoute({
	getParentRoute: () => root,
	path: "/glosuj/oddany",
	validateSearch: (s: Record<string, unknown>) => ({
		tx: typeof s.tx === "string" ? s.tx : undefined,
	}),
	component: function OddanyRoute() {
		const { tx } = oddany.useSearch();
		return <Oddany tx={tx} />;
	},
});

const routeTree = root.addChildren([
	r("/", Start),
	r("/uslugi", Uslugi),
	r("/uslugi/wybory", WyboryEkran),
	r("/uslugi/wybory/szczegoly/$id", Szczegoly),
	r("/uslugi/wybory/rejestr", Rejestr),
	r("/uslugi/wybory/historia", Historia),
	r("/glosuj/logowanie", Logowanie),
	r("/glosuj/dokument", Dokument),
	r("/glosuj/twarz", Twarz),
	r("/glosuj/tozsamosc", Tozsamosc),
	r("/glosuj/rodzaj", Rodzaj),
	r("/glosuj/karta", Karta),
	r("/glosuj/potwierdzenie", Potwierdzenie),
	oddany,
	r("/o-projekcie", OProjekcie),
]);

// Hash history, żeby GitHub Pages działało bez przepisywania adresów.
export const router = createRouter({ routeTree, history: createHashHistory() });
