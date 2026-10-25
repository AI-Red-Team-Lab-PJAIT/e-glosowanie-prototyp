import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { loguj } from "../debug/dziennik";
import type { Pokwitowanie } from "../ledger/ledger";
import { type Akcja, reducer, type Stan, stanPoczatkowy } from "./stan";

const KLUCZ = "e-glosowanie:historia";

export type OdczytHistorii = { historia: Pokwitowanie[]; blad: boolean };

export function wczytajHistorie(): OdczytHistorii {
	try {
		const surowe = localStorage.getItem(KLUCZ);
		if (!surowe) return { historia: [], blad: false };
		const dane = JSON.parse(surowe);
		return Array.isArray(dane) ? { historia: dane, blad: false } : { historia: [], blad: true };
	} catch {
		return { historia: [], blad: true };
	}
}

function zapiszHistorie(h: Pokwitowanie[]) {
	try {
		localStorage.setItem(KLUCZ, JSON.stringify(h));
	} catch {
		// Tryb prywatny albo zablokowana pamięć: historia zostaje tylko w tej sesji.
	}
}

type Kontekst = { stan: Stan; dispatch: (a: Akcja) => void; bladPamieci: boolean };

const Ctx = createContext<Kontekst | null>(null);

const odczyt = wczytajHistorie();

export function StanProvider({ children }: { children: ReactNode }) {
	const [stan, surowyDispatch] = useReducer(reducer, odczyt.historia, stanPoczatkowy);
	const dispatch = useCallback((a: Akcja) => {
		loguj("akcja", { akcja: a });
		surowyDispatch(a);
	}, []);

	useEffect(() => {
		if (odczyt.blad) loguj("blad", { msg: "nie udało się odczytać historii z localStorage" });
	}, []);
	useEffect(
		() =>
			loguj("info", {
				stan: true,
				mfa: stan.mfa,
				wybory: stan.wyboryId,
				opcja: stan.opcjaId,
				glosy: stan.historia.length,
			}),
		[stan],
	);

	useEffect(() => zapiszHistorie(stan.historia), [stan.historia]);

	const wartosc = useMemo(() => ({ stan, dispatch, bladPamieci: odczyt.blad }), [stan, dispatch]);
	return <Ctx.Provider value={wartosc}>{children}</Ctx.Provider>;
}

export function useStan() {
	const c = useContext(Ctx);
	if (!c) throw new Error("useStan poza StanProvider");
	return c;
}
