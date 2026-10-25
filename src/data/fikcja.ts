// Wszystkie osoby, komitety, adresy i daty są zmyślone na potrzeby pokazu.

export type Wyborca = {
	imie: string;
	nazwisko: string;
	pesel: string;
	adres: string;
	gmina: string;
};

export const wyborca: Wyborca = {
	imie: "Jan",
	nazwisko: "Przykładowy",
	pesel: "•••••••1234",
	adres: "ul. Testowa 7 m. 12, 00-950 Warszawa",
	gmina: "Warszawa, dzielnica Śródmieście",
};

export const obwod = {
	numer: 112,
	nazwa: "Obwodowa Komisja Wyborcza nr 112",
	miejsce: "Szkoła Podstawowa nr 3",
	adres: "ul. Przykładowa 1, 00-950 Warszawa",
	godziny: "7:00 do 21:00",
};

export type Kandydat = { id: string; imie: string; nazwisko: string; opis: string };
export type Komitet = { id: string; numer: number; nazwa: string; kandydaci: Kandydat[] };

type WyboryBase = { id: string; nazwa: string; krotko: string; data: string; dataIso: string };

export type Wybory =
	| (WyboryBase & { typ: "jeden"; kandydaci: Kandydat[] })
	| (WyboryBase & { typ: "listy"; okreg: string; komitety: Komitet[] })
	| (WyboryBase & { typ: "referendum"; pytanie: string });

const k = (id: string, imie: string, nazwisko: string, opis: string): Kandydat => ({
	id,
	imie,
	nazwisko,
	opis,
});

export const wybory: Wybory[] = [
	{
		id: "prezydent",
		typ: "jeden",
		nazwa: "Wybory Prezydenta RP",
		krotko: "Prezydenckie",
		data: "niedziela, 16 maja 2027",
		dataIso: "2027-05-16",
		kandydaci: [
			k("p1", "Anna", "Wzorcowa", "lat 52, ekonomistka, Kraków"),
			k("p2", "Piotr", "Fikcyjny", "lat 47, lekarz, Gdańsk"),
			k("p3", "Maria", "Testowa", "lat 58, nauczycielka, Lublin"),
			k("p4", "Tomasz", "Przykładny", "lat 41, przedsiębiorca, Poznań"),
		],
	},
	{
		id: "sejm",
		typ: "listy",
		nazwa: "Wybory do Sejmu RP",
		krotko: "Sejm",
		data: "niedziela, 10 października 2027",
		dataIso: "2027-10-10",
		okreg: "Okręg wyborczy nr 19, Warszawa",
		komitety: [
			{
				id: "s1",
				numer: 1,
				nazwa: "KW Ruch Przykładowy",
				kandydaci: [
					k("s1a", "Katarzyna", "Lipowa", "lat 39, prawniczka"),
					k("s1b", "Marek", "Dębowy", "lat 55, inżynier"),
					k("s1c", "Ewa", "Klonowa", "lat 33, pielęgniarka"),
				],
			},
			{
				id: "s2",
				numer: 2,
				nazwa: "KW Porozumienie Testowe",
				kandydaci: [
					k("s2a", "Paweł", "Brzozowy", "lat 46, rolnik"),
					k("s2b", "Joanna", "Jesionowa", "lat 50, urzędniczka"),
				],
			},
			{
				id: "s3",
				numer: 3,
				nazwa: "KW Lista Wzorcowa",
				kandydaci: [
					k("s3a", "Adam", "Sosnowy", "lat 61, emeryt"),
					k("s3b", "Zofia", "Grabowa", "lat 28, programistka"),
				],
			},
		],
	},
	{
		id: "pe",
		typ: "listy",
		nazwa: "Wybory do Parlamentu Europejskiego",
		krotko: "Parlament Europejski",
		data: "niedziela, 4 czerwca 2028",
		dataIso: "2028-06-04",
		okreg: "Okręg wyborczy nr 4, Warszawa",
		komitety: [
			{
				id: "e1",
				numer: 1,
				nazwa: "KW Wspólnota Przykładowa",
				kandydaci: [
					k("e1a", "Agnieszka", "Bukowa", "lat 44, tłumaczka"),
					k("e1b", "Robert", "Wiązowy", "lat 49, ekonomista"),
				],
			},
			{
				id: "e2",
				numer: 2,
				nazwa: "KW Europa Testowa",
				kandydaci: [
					k("e2a", "Michał", "Jodłowy", "lat 37, dziennikarz"),
					k("e2b", "Alicja", "Cisowa", "lat 42, lekarka"),
				],
			},
		],
	},
	{
		id: "referendum",
		typ: "referendum",
		nazwa: "Referendum ogólnokrajowe",
		krotko: "Referendum",
		data: "niedziela, 7 listopada 2027",
		dataIso: "2027-11-07",
		pytanie:
			"Czy jesteś za wprowadzeniem możliwości głosowania przez internet w wyborach powszechnych?",
	},
];

export const znajdzWybory = (id: string) => wybory.find((w) => w.id === id);

export type Wybor = { wyboryId: string; opcjaId: string; etykieta: string; podpis?: string };

export function opisWyboru(w: Wybory, opcjaId: string): Wybor | undefined {
	if (w.typ === "referendum") {
		if (opcjaId !== "tak" && opcjaId !== "nie") return undefined;
		return {
			wyboryId: w.id,
			opcjaId,
			etykieta: opcjaId === "tak" ? "TAK" : "NIE",
			podpis: w.pytanie,
		};
	}
	if (w.typ === "jeden") {
		const c = w.kandydaci.find((x) => x.id === opcjaId);
		return c && { wyboryId: w.id, opcjaId, etykieta: `${c.imie} ${c.nazwisko}`, podpis: c.opis };
	}
	for (const kom of w.komitety) {
		const c = kom.kandydaci.find((x) => x.id === opcjaId);
		if (c) {
			return {
				wyboryId: w.id,
				opcjaId,
				etykieta: `${c.imie} ${c.nazwisko}`,
				podpis: `Lista nr ${kom.numer}, ${kom.nazwa}`,
			};
		}
	}
	return undefined;
}
