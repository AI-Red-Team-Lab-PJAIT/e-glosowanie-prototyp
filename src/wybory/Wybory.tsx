import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { obwod, wyborca, wybory, znajdzWybory } from "../data/fikcja";
import { skrot } from "../ledger/ledger";
import { useStan } from "../state/StanProvider";
import { juzGlosowal } from "../state/stan";
import { Info, UWybory } from "../ui/ikony";
import { NavBar, NIEDOSTEPNE, RowLink, Sheet, useToast } from "../ui/komponenty";

const dataKrotka = (iso: string) => iso.split("-").reverse().join(".");

export function WyboryEkran() {
	const { stan } = useStan();
	return (
		<>
			<NavBar tytul="Wybory" wstecz="/uslugi" />
			<div className="pad">
				<div className="hero-icon">
					<UWybory />
				</div>
				<h1 className="large-title">Masz czynne prawo wyborcze</h1>

				<h2 className="section-h">Zaplanowane wybory</h2>
				{wybory.map((w) => (
					<div className="card" key={w.id}>
						<RowLink
							to="/uslugi/wybory/szczegoly/$id"
							params={{ id: w.id }}
							tytul={w.nazwa}
							podpis={
								juzGlosowal(stan, w.id)
									? `${dataKrotka(w.dataIso)} · głos oddany`
									: dataKrotka(w.dataIso)
							}
						/>
					</div>
				))}

				<h2 className="section-h">Głosowanie przez internet</h2>
				<div className="card">
					<RowLink
						to="/uslugi/wybory/historia"
						tytul="Historia głosowań"
						podpis={
							stan.historia.length
								? `Oddane głosy: ${stan.historia.length}`
								: "Tu zobaczysz potwierdzenia oddanych głosów."
						}
					/>
				</div>
				<div className="actions">
					<Link to="/glosuj/logowanie" className="btn primary">
						Zagłosuj przez internet
					</Link>
				</div>

				<h2 className="section-h">Pozostałe dane</h2>
				<div className="card">
					<RowLink
						to="/uslugi/wybory/rejestr"
						tytul="Twoje dane w rejestrze"
						podpis="Tu znajdziesz informacje o Twoim obwodzie i okręgu głosowania."
					/>
				</div>
			</div>
		</>
	);
}

function plikIcs(nazwa: string, iso: string) {
	const d = iso.replaceAll("-", "");
	const tresc = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//AI Red Team Lab//e-glosowanie prototyp//PL",
		"BEGIN:VEVENT",
		`UID:${d}-${nazwa.length}@e-glosowanie.prototyp`,
		`DTSTART;VALUE=DATE:${d}`,
		`SUMMARY:${nazwa} (prototyp, dane fikcyjne)`,
		`LOCATION:${obwod.miejsce}, ${obwod.adres}`,
		"END:VEVENT",
		"END:VCALENDAR",
	].join("\r\n");
	const url = URL.createObjectURL(new Blob([tresc], { type: "text/calendar" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = `wybory-${iso}.ics`;
	a.click();
	URL.revokeObjectURL(url);
}

export function Szczegoly() {
	const { id } = useParams({ strict: false }) as { id: string };
	const w = znajdzWybory(id);
	const toast = useToast();

	if (!w) {
		return (
			<>
				<NavBar tytul="Szczegóły wydarzenia" wstecz="/uslugi/wybory" />
				<p className="empty error">
					<b>Nie znaleziono wyborów</b>Wróć do listy i wybierz jedne z zaplanowanych wyborów.
				</p>
			</>
		);
	}

	const kopiuj = async () => {
		try {
			await navigator.clipboard.writeText(obwod.adres);
			toast("Skopiowano adres");
		} catch {
			toast("Nie udało się skopiować adresu");
		}
	};

	return (
		<>
			<NavBar tytul="Szczegóły wydarzenia" wstecz="/uslugi/wybory" />
			<div className="pad">
				<h1 className="section-h" style={{ fontSize: 22, lineHeight: "28px", marginTop: 12 }}>
					{w.nazwa}
				</h1>
				<div className="card">
					<div className="row">
						<div className="field txt">
							<span className="l">Data wyborów</span>
							<span className="v">{dataKrotka(w.dataIso)}</span>
						</div>
						<button type="button" className="pill" onClick={() => plikIcs(w.nazwa, w.dataIso)}>
							Do kalendarza
						</button>
					</div>
				</div>

				<h2 className="section-h">Twoje miejsce głosowania</h2>
				<div className="card">
					<div className="row field">
						<span className="l">Siedziba obwodowej komisji wyborczej</span>
						<span className="v">{obwod.miejsce}</span>
					</div>
					<div className="row">
						<div className="field txt">
							<span className="l">Adres</span>
							<span className="v">{obwod.adres}</span>
						</div>
						<button type="button" className="pill" onClick={kopiuj}>
							Kopiuj
						</button>
					</div>
					<div className="row field">
						<span className="l">Gmina</span>
						<span className="v">{wyborca.gmina}</span>
					</div>
					<div className="row field">
						<span className="l">Numer obwodu</span>
						<span className="v">{obwod.numer}</span>
					</div>
				</div>

				<div className="infobox">
					<Info />
					<div>
						<p>
							Nie możesz zagłosować w siedzibie swojej komisji? W tym prototypie możesz oddać głos
							przez internet.
						</p>
						<Link to="/glosuj/logowanie" className="link">
							Zagłosuj przez internet
						</Link>
						<button
							type="button"
							className="link"
							style={{ display: "block" }}
							onClick={() => toast(NIEDOSTEPNE)}
						>
							Zmień miejsce głosowania
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export function Rejestr() {
	const rows: [string, string][] = [
		["Imię i nazwisko", `${wyborca.imie} ${wyborca.nazwisko}`],
		["PESEL", wyborca.pesel],
		["Adres zameldowania", wyborca.adres],
		["Gmina", wyborca.gmina],
		["Obwód głosowania", `nr ${obwod.numer}, ${obwod.miejsce}`],
		["Okręg do Sejmu", "nr 19, Warszawa"],
	];
	return (
		<>
			<NavBar tytul="Twoje dane w rejestrze" wstecz="/uslugi/wybory" />
			<div className="pad">
				<p className="lead" style={{ marginTop: 12 }}>
					Dane z Centralnego Rejestru Wyborców. W prototypie to fikcyjna osoba.
				</p>
				<div className="card">
					{rows.map(([l, v]) => (
						<div className="row field" key={l}>
							<span className="l">{l}</span>
							<span className="v">{v}</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export function Historia() {
	const { stan, dispatch, bladPamieci } = useStan();
	const [pytaj, setPytaj] = useState(false);
	const czas = (iso: string) =>
		new Date(iso).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });

	return (
		<>
			<NavBar tytul="Historia głosowań" wstecz="/uslugi/wybory" />
			<div className="pad">
				{bladPamieci && (
					<p className="empty error" role="alert">
						<b>Nie udało się odczytać zapisanej historii</b>Przeglądarka blokuje pamięć strony. Nowe
						głosy zobaczysz tylko do zamknięcia karty.
					</p>
				)}
				{stan.historia.length === 0 ? (
					<div className="empty">
						<b>Nie oddano jeszcze żadnego głosu</b>
						Po oddaniu głosu zobaczysz tu jego potwierdzenie z identyfikatorem zapisu.
						<div className="actions">
							<Link to="/glosuj/logowanie" className="btn primary">
								Zagłosuj przez internet
							</Link>
						</div>
					</div>
				) : (
					<>
						<p className="lead" style={{ marginTop: 12 }}>
							Historia nie przechowuje treści głosu, tylko dowód, że został zapisany.
						</p>
						{stan.historia.map((p) => (
							<div className="card" key={p.tx}>
								<div className="row field" data-zmienne>
									<span className="l">{czas(p.czas)}</span>
									<span className="v">{znajdzWybory(p.wyboryId)?.nazwa ?? p.wyboryId}</span>
								</div>
								<div className="row field">
									<span className="l">Skrót głosu (SHA-256)</span>
									<span className="v mono">{skrot(p.hash, 16)}</span>
								</div>
								<div className="row field">
									<span className="l">Identyfikator zapisu</span>
									<span className="v mono">{skrot(p.tx, 14)}</span>
								</div>
							</div>
						))}
						<div className="actions">
							<button type="button" className="btn secondary" onClick={() => setPytaj(true)}>
								Wyczyść historię prototypu
							</button>
						</div>
					</>
				)}
			</div>
			{pytaj && (
				<Sheet tytul="Wyczyścić historię?" onClose={() => setPytaj(false)}>
					<p className="lead" style={{ margin: "4px 0 20px" }}>
						Usuniesz zapisane głosy z tej przeglądarki i znów będzie można zagłosować w każdych
						wyborach. Przydaje się przed kolejnym pokazem.
					</p>
					<button
						type="button"
						className="btn primary"
						onClick={() => {
							dispatch({ typ: "wyczyscHistorie" });
							setPytaj(false);
						}}
					>
						Wyczyść historię
					</button>
					<button type="button" className="btn secondary" onClick={() => setPytaj(false)}>
						Anuluj
					</button>
				</Sheet>
			)}
		</>
	);
}
