// Dziennik debugowania: klik, ekran, akcja stanu, błąd. W dev idzie do konsoli i do pliku
// debug/sesja.jsonl przez endpoint Vite; na produkcji tylko do konsoli i tylko z ?debug=1.

type Zdarzenie = {
	t: string;
	typ: "start" | "klik" | "ekran" | "akcja" | "blad" | "info";
	ekran: string;
	[k: string]: unknown;
};

const DEV = import.meta.env.DEV;
const wlaczony = () => {
	if (DEV) return true;
	try {
		return new URLSearchParams(window.location.search).has("debug");
	} catch {
		return false;
	}
};

const sesja = Math.random().toString(36).slice(2, 8);
let kolejka: Zdarzenie[] = [];
let timer: number | undefined;

const ekran = () => window.location.hash.replace(/^#/, "") || "/";

function wyslij() {
	timer = undefined;
	// Testy Playwrighta (navigator.webdriver) nie zaśmiecają pliku z sesji człowieka.
	if (!DEV || navigator.webdriver || kolejka.length === 0) return;
	const paczka = kolejka;
	kolejka = [];
	fetch("/__debug", { method: "POST", body: JSON.stringify(paczka), keepalive: true }).catch(() => {
		// Serwer dev mógł się zrestartować; zdarzenia zostają w konsoli.
	});
}

export function loguj(typ: Zdarzenie["typ"], dane: Record<string, unknown> = {}) {
	if (!wlaczony()) return;
	const z: Zdarzenie = { t: new Date().toISOString(), sesja, typ, ekran: ekran(), ...dane };
	console.debug(`[e-gl] ${typ}`, dane);
	kolejka.push(z);
	timer ??= window.setTimeout(wyslij, 300);
}

// Krótki opis klikniętego elementu: rola, nazwa dostępna i stan.
function opis(el: Element) {
	const cel = el.closest("a, button, label, input, [role]") ?? el;
	const tekst = (cel.getAttribute("aria-label") ?? cel.textContent ?? "")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 80);
	return {
		tag: cel.tagName.toLowerCase(),
		tekst,
		href: cel.getAttribute("href") ?? undefined,
		disabled:
			(cel as HTMLButtonElement).disabled ||
			cel.getAttribute("aria-disabled") === "true" ||
			undefined,
		klasa: cel.getAttribute("class") ?? undefined,
	};
}

export function startDziennika() {
	if (!wlaczony()) return;
	loguj("start", {
		ua: navigator.userAgent,
		okno: `${window.innerWidth}x${window.innerHeight}`,
		url: window.location.href,
		bezpieczny: window.isSecureContext,
	});
	document.addEventListener(
		"click",
		(e) => e.target instanceof Element && loguj("klik", opis(e.target)),
		true,
	);
	window.addEventListener("error", (e) =>
		loguj("blad", { msg: e.message, gdzie: `${e.filename}:${e.lineno}` }),
	);
	window.addEventListener("unhandledrejection", (e) => loguj("blad", { msg: String(e.reason) }));
	window.addEventListener("pagehide", wyslij);
}
