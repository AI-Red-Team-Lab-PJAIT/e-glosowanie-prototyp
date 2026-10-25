import { describe, expect, it } from "vitest";
import { opisWyboru, wybory, znajdzWybory } from "../../src/data/fikcja";
import { _sha256Js, hashGlosu, zapiszGlos } from "../../src/ledger/ledger";
import {
	type Akcja,
	mfaKompletne,
	mozeOddac,
	reducer,
	type Stan,
	stanPoczatkowy,
} from "../../src/state/stan";

const po = (s: Stan, ...akcje: Akcja[]) => akcje.reduce(reducer, s);
const zMfa = () =>
	po(
		stanPoczatkowy(),
		{ typ: "krok", krok: "logowanie" },
		{ typ: "krok", krok: "dokument" },
		{ typ: "krok", krok: "twarz" },
	);

describe("MFA", () => {
	it("nie zalicza skanu twarzy przed dokumentem", () => {
		const s = po(
			stanPoczatkowy(),
			{ typ: "krok", krok: "logowanie" },
			{ typ: "krok", krok: "twarz" },
		);
		expect(s.mfa.twarz).toBe(false);
		expect(mfaKompletne(s)).toBe(false);
	});

	it("zalicza kroki po kolei", () => {
		expect(mfaKompletne(zMfa())).toBe(true);
	});

	it("wylogowanie czyści MFA, ale zostawia historię", async () => {
		const p = await zapiszGlos("prezydent", "p1", "sol");
		const s = po(
			zMfa(),
			{ typ: "wybierzWybory", id: "prezydent" },
			{ typ: "wybierzOpcje", id: "p1" },
			{ typ: "oddano", pokwitowanie: p },
			{ typ: "wyloguj" },
		);
		expect(mfaKompletne(s)).toBe(false);
		expect(s.historia).toHaveLength(1);
	});
});

describe("oddawanie głosu", () => {
	it("bez MFA głos nie zostaje zapisany", async () => {
		const p = await zapiszGlos("prezydent", "p1", "sol");
		const s = po(
			stanPoczatkowy(),
			{ typ: "wybierzWybory", id: "prezydent" },
			{ typ: "wybierzOpcje", id: "p1" },
		);
		expect(mozeOddac(s)).toBe(false);
		expect(reducer(s, { typ: "oddano", pokwitowanie: p }).historia).toHaveLength(0);
	});

	it("w jednych wyborach można zagłosować tylko raz", async () => {
		const p1 = await zapiszGlos("sejm", "s1a", "a");
		const p2 = await zapiszGlos("sejm", "s2a", "b");
		let s = po(
			zMfa(),
			{ typ: "wybierzWybory", id: "sejm" },
			{ typ: "wybierzOpcje", id: "s1a" },
			{ typ: "oddano", pokwitowanie: p1 },
		);
		s = po(s, { typ: "wybierzOpcje", id: "s2a" }, { typ: "oddano", pokwitowanie: p2 });
		expect(s.historia.map((h) => h.hash)).toEqual([p1.hash]);
	});

	it("pokwitowanie z innych wyborów jest odrzucane", async () => {
		const obce = await zapiszGlos("pe", "e1a", "x");
		const s = po(
			zMfa(),
			{ typ: "wybierzWybory", id: "sejm" },
			{ typ: "wybierzOpcje", id: "s1a" },
			{ typ: "oddano", pokwitowanie: obce },
		);
		expect(s.historia).toHaveLength(0);
	});

	it("zmiana wyborów kasuje zaznaczony wybór", () => {
		const s = po(
			zMfa(),
			{ typ: "wybierzWybory", id: "sejm" },
			{ typ: "wybierzOpcje", id: "s1a" },
			{ typ: "wybierzWybory", id: "referendum" },
		);
		expect(s.opcjaId).toBeNull();
	});
});

describe("ledger", () => {
	it("hash jest deterministyczny dla tej samej soli", async () => {
		expect(await hashGlosu("prezydent", "p1", "sol")).toBe(
			await hashGlosu("prezydent", "p1", "sol"),
		);
	});

	it("inna sól daje inny hash", async () => {
		expect(await hashGlosu("prezydent", "p1", "a")).not.toBe(
			await hashGlosu("prezydent", "p1", "b"),
		);
	});

	it("SHA-256 w JS zgadza się z wektorem testowym", () => {
		const abc = new TextEncoder().encode("abc");
		expect(_sha256Js(abc)).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
		expect(_sha256Js(new Uint8Array())).toBe(
			"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
		);
	});

	it("pokwitowanie ma tx w formacie 0x + 40 znaków hex", async () => {
		const p = await zapiszGlos("referendum", "tak", "sol", new Date("2027-11-07T10:00:00Z"));
		expect(p.tx).toMatch(/^0x[0-9a-f]{40}$/);
		expect(p.czas).toBe("2027-11-07T10:00:00.000Z");
	});
});

describe("dane fikcyjne", () => {
	it("każde wybory mają opis dla poprawnej opcji i odrzucają złą", () => {
		for (const w of wybory) {
			const ok =
				w.typ === "referendum"
					? "tak"
					: w.typ === "jeden"
						? w.kandydaci[0].id
						: w.komitety[0].kandydaci[0].id;
			expect(opisWyboru(w, ok)?.etykieta).toBeTruthy();
			expect(opisWyboru(w, "nie-ma-takiej")).toBeUndefined();
		}
	});

	it("głos na listę zawiera numer i nazwę komitetu", () => {
		const sejm = znajdzWybory("sejm");
		expect(sejm && opisWyboru(sejm, "s2b")?.podpis).toBe("Lista nr 2, KW Porozumienie Testowe");
	});
});
