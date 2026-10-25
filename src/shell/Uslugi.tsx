import { useNavigate } from "@tanstack/react-router";
import { type ComponentType, type SVGProps, useState } from "react";
import {
	Szukaj,
	UBilet,
	UMandaty,
	UPesel,
	UPeselSprawdz,
	UPojazd,
	UPowietrze,
	UPunkty,
	URecepta,
	UWybory,
	UZus,
} from "../ui/ikony";
import { NIEDOSTEPNE, RowButton, useToast } from "../ui/komponenty";

type Usluga = {
	nazwa: string;
	kolor: string;
	Ikona: ComponentType<SVGProps<SVGSVGElement>>;
	sciezka?: string;
};

// Kolejność i kolory jak na liście usług w aplikacji (zrzut w docs/referencje).
const naPulpicie: Usluga[] = [
	{ nazwa: "Wybory", kolor: "#1f5fdc", Ikona: UWybory, sciezka: "/uslugi/wybory" },
	{ nazwa: "Mandaty", kolor: "#1f5fdc", Ikona: UMandaty },
	{ nazwa: "Zastrzeż PESEL", kolor: "#5b3cc4", Ikona: UPesel },
	{ nazwa: "Punkty karne", kolor: "#1d4ea8", Ikona: UPunkty },
	{ nazwa: "Historia pojazdu", kolor: "#3c9a4a", Ikona: UPojazd },
	{ nazwa: "Jakość powietrza", kolor: "#2f7de1", Ikona: UPowietrze },
	{ nazwa: "eRecepta", kolor: "#178a8f", Ikona: URecepta },
];
const pozostale: Usluga[] = [
	{ nazwa: "Sprawdź PESEL", kolor: "#1f5fdc", Ikona: UPeselSprawdz },
	{ nazwa: "Bilkom", kolor: "#d1453b", Ikona: UBilet },
	{ nazwa: "e-wizyta w ZUS", kolor: "#2e7d32", Ikona: UZus },
];

export function Uslugi() {
	const [fraza, setFraza] = useState("");
	const navigate = useNavigate();
	const toast = useToast();
	const pasuje = (u: Usluga) =>
		u.nazwa.toLocaleLowerCase("pl").includes(fraza.trim().toLocaleLowerCase("pl"));

	const lista = (tytul: string, uslugi: Usluga[]) => {
		const widoczne = uslugi.filter(pasuje);
		if (widoczne.length === 0) return null;
		return (
			<section>
				<h2 className="section-h">{tytul}</h2>
				<div className="card" style={{ ["--inset" as string]: "56px" }}>
					{widoczne.map((u) => (
						<RowButton
							key={u.nazwa}
							tytul={u.nazwa}
							regular
							disabled={!u.sciezka}
							ikona={<u.Ikona className="ico" style={{ color: u.kolor }} />}
							onClick={() => (u.sciezka ? navigate({ to: u.sciezka }) : toast(NIEDOSTEPNE))}
						/>
					))}
				</div>
			</section>
		);
	};

	const nic = ![...naPulpicie, ...pozostale].some(pasuje);

	return (
		<div className="pad" style={{ paddingTop: 16 }}>
			<h1 className="large-title">Usługi</h1>
			<label className="search">
				<Szukaj />
				<span className="sr-only">Szukaj usługi</span>
				<input
					type="search"
					placeholder="Szukaj"
					value={fraza}
					onChange={(e) => setFraza(e.target.value)}
				/>
			</label>
			{lista("Na pulpicie", naPulpicie)}
			{lista("Pozostałe", pozostale)}
			{nic && (
				<p className="empty">
					<b>Brak usługi „{fraza}”</b>W prototypie działa tylko usługa Wybory.
				</p>
			)}
		</div>
	);
}
