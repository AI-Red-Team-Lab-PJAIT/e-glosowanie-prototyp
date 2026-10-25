import type { Pokwitowanie } from "../ledger/ledger";

export type Krok = "logowanie" | "dokument" | "twarz";

export type Stan = {
	mfa: Record<Krok, boolean>;
	wyboryId: string | null;
	opcjaId: string | null;
	historia: Pokwitowanie[];
};

export type Akcja =
	| { typ: "krok"; krok: Krok }
	| { typ: "wybierzWybory"; id: string }
	| { typ: "wybierzOpcje"; id: string }
	| { typ: "oddano"; pokwitowanie: Pokwitowanie }
	| { typ: "wyczyscHistorie" }
	| { typ: "wyloguj" };

export const pustaMfa: Record<Krok, boolean> = { logowanie: false, dokument: false, twarz: false };

export const stanPoczatkowy = (historia: Pokwitowanie[] = []): Stan => ({
	mfa: { ...pustaMfa },
	wyboryId: null,
	opcjaId: null,
	historia,
});

export const kolejnoscKrokow: Krok[] = ["logowanie", "dokument", "twarz"];

export const mfaKompletne = (s: Stan) => kolejnoscKrokow.every((k) => s.mfa[k]);

export const juzGlosowal = (s: Stan, wyboryId: string) =>
	s.historia.some((p) => p.wyboryId === wyboryId);

export const mozeOddac = (s: Stan) =>
	mfaKompletne(s) && s.wyboryId !== null && s.opcjaId !== null && !juzGlosowal(s, s.wyboryId);

export function reducer(s: Stan, a: Akcja): Stan {
	switch (a.typ) {
		case "krok": {
			// Kroki MFA zaliczamy tylko po kolei, żeby nie dało się przeskoczyć skanu.
			const i = kolejnoscKrokow.indexOf(a.krok);
			const poprzednie = kolejnoscKrokow.slice(0, i).every((k) => s.mfa[k]);
			return poprzednie ? { ...s, mfa: { ...s.mfa, [a.krok]: true } } : s;
		}
		case "wybierzWybory":
			if (s.wyboryId === a.id) return s;
			return { ...s, wyboryId: a.id, opcjaId: null };
		case "wybierzOpcje":
			return { ...s, opcjaId: a.id };
		case "oddano": {
			if (!mozeOddac(s) || a.pokwitowanie.wyboryId !== s.wyboryId) return s;
			return { ...s, historia: [a.pokwitowanie, ...s.historia], opcjaId: null };
		}
		case "wyczyscHistorie":
			return { ...s, historia: [] };
		case "wyloguj":
			return stanPoczatkowy(s.historia);
	}
}
