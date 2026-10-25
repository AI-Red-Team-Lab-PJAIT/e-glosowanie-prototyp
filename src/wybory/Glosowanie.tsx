import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { opisWyboru, type Wybory, wyborca, wybory, znajdzWybory } from "../data/fikcja";
import { loguj } from "../debug/dziennik";
import { zapiszGlos } from "../ledger/ledger";
import { useStan } from "../state/StanProvider";
import { juzGlosowal, type Krok, kolejnoscKrokow, mfaKompletne } from "../state/stan";
import { Lancuch, Ok } from "../ui/ikony";
import { NavBar, NIEDOSTEPNE, Stepper, useToast } from "../ui/komponenty";

const sciezkaKroku: Record<Krok, string> = {
	logowanie: "/glosuj/logowanie",
	dokument: "/glosuj/dokument",
	twarz: "/glosuj/twarz",
};

// Ekran wpuszcza tylko po zaliczeniu wcześniejszych kroków MFA.
function Wymaga({ krokow, children }: { krokow: Krok[]; children: React.ReactNode }) {
	const { stan } = useStan();
	const brak = kolejnoscKrokow.find((k) => krokow.includes(k) && !stan.mfa[k]);
	return brak ? <Navigate to={sciezkaKroku[brak]} replace /> : children;
}

const czekaj = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

export function Logowanie() {
	const { dispatch } = useStan();
	const navigate = useNavigate();
	const toast = useToast();
	const dalej = () => {
		dispatch({ typ: "krok", krok: "logowanie" });
		navigate({ to: "/glosuj/dokument" });
	};
	return (
		<>
			<NavBar tytul="Głosowanie" wstecz="/uslugi/wybory" />
			<div className="pad">
				<h1 className="large-title" style={{ fontSize: 28, lineHeight: "34px" }}>
					Potwierdź, że to Ty
				</h1>
				<p className="lead">
					Głosowanie przez internet wymaga trzech potwierdzeń: logowania, skanu dowodu i skanu
					twarzy.
				</p>
				<h2 className="section-h">Zaloguj się przez</h2>
				<button type="button" className="btn primary" onClick={dalej}>
					Profil zaufany
				</button>
				<button type="button" className="btn secondary" onClick={dalej}>
					Twój bank
				</button>
				<p className="lead" style={{ marginTop: 20, fontSize: 14 }}>
					W prototypie oba przyciski od razu przechodzą dalej. Niczego nie wpisujesz i nic nie jest
					wysyłane.
				</p>
				<button
					type="button"
					className="link"
					style={{ color: "var(--accent)", fontWeight: 600, minHeight: 44 }}
					onClick={() => toast(NIEDOSTEPNE)}
				>
					Inne sposoby logowania
				</button>
			</div>
		</>
	);
}

type FazaNfc = "start" | "czyta" | "gotowe";

export function Dokument() {
	const { dispatch } = useStan();
	const navigate = useNavigate();
	const [faza, setFaza] = useState<FazaNfc>("start");

	const skanuj = async () => {
		setFaza("czyta");
		await czekaj(1800);
		dispatch({ typ: "krok", krok: "dokument" });
		setFaza("gotowe");
	};

	const status = {
		start: [
			"Przyłóż telefon do dowodu",
			"Połóż dowód osobisty na płaskiej powierzchni i przyłóż do niego tył telefonu.",
		],
		czyta: ["Odczytywanie chipu…", "Nie odsuwaj telefonu od dowodu."],
		gotowe: [
			"Dowód odczytany",
			`Dane z chipu zgadzają się z rejestrem: ${wyborca.imie} ${wyborca.nazwisko}.`,
		],
	}[faza];

	return (
		<Wymaga krokow={["logowanie"]}>
			<NavBar tytul="Skan dokumentu" wstecz="/glosuj/logowanie" />
			<div className="pad">
				<Stepper krok={1} />
				<div className="scan" data-faza={faza} aria-hidden="true">
					<svg viewBox="0 0 240 200" width="240" height="200">
						<rect
							x="40"
							y="110"
							width="160"
							height="80"
							rx="10"
							fill="#e9eef5"
							stroke="#b9c3d3"
							strokeWidth="2"
						/>
						<rect x="56" y="126" width="36" height="46" rx="4" fill="#c9d3e2" />
						<rect x="104" y="132" width="76" height="7" rx="3.5" fill="#c9d3e2" />
						<rect x="104" y="148" width="56" height="7" rx="3.5" fill="#c9d3e2" />
						<rect x="150" y="160" width="26" height="20" rx="3" fill="#d8c27a" />
						<g className="nfc-phone">
							<rect x="78" y="6" width="84" height="120" rx="14" fill="#111216" />
							<rect
								x="84"
								y="12"
								width="72"
								height="108"
								rx="9"
								fill={faza === "gotowe" ? "#2e7d32" : "#1f5fdc"}
							/>
							{faza === "gotowe" ? (
								<path
									d="m106 66 10 10 20-20"
									stroke="#fff"
									strokeWidth="6"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							) : (
								<g
									className="nfc-waves"
									stroke="#fff"
									strokeWidth="4"
									fill="none"
									strokeLinecap="round"
								>
									<path d="M108 54a18 18 0 0 1 0 24M118 46a30 30 0 0 1 0 40M128 38a42 42 0 0 1 0 56" />
								</g>
							)}
						</g>
					</svg>
				</div>
				<p className="scan-status" role="status">
					{status[0]}
				</p>
				<p className="scan-sub">{status[1]}</p>
				<div className="actions">
					{faza === "gotowe" ? (
						<button
							type="button"
							className="btn primary"
							onClick={() => navigate({ to: "/glosuj/twarz" })}
						>
							Dalej
						</button>
					) : (
						<button
							type="button"
							className="btn primary"
							disabled={faza === "czyta"}
							onClick={skanuj}
						>
							{faza === "czyta" ? "Skanowanie…" : "Rozpocznij skanowanie"}
						</button>
					)}
				</div>
			</div>
		</Wymaga>
	);
}

const ruchy = [
	{ tekst: "Patrz prosto w kamerę", dx: 0, dy: 0 },
	{ tekst: "Powoli obróć głowę w lewo", dx: -14, dy: 0 },
	{ tekst: "Teraz w prawo", dx: 14, dy: 0 },
	{ tekst: "Unieś lekko brodę", dx: 0, dy: -12 },
];

export function Twarz() {
	const { dispatch } = useStan();
	const navigate = useNavigate();
	const [etap, setEtap] = useState(-1);
	const [kamera, setKamera] = useState<"wyl" | "wl" | "blad">("wyl");
	const video = useRef<HTMLVideoElement>(null);
	const strumien = useRef<MediaStream | null>(null);
	const gotowe = etap >= ruchy.length;

	useEffect(
		() => () =>
			strumien.current?.getTracks().forEach((t) => {
				t.stop();
			}),
		[],
	);

	const wlaczKamere = async () => {
		try {
			// Obraz zostaje w przeglądarce: nie zapisujemy go i nigdzie nie wysyłamy.
			const s = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
				audio: false,
			});
			strumien.current = s;
			if (video.current) video.current.srcObject = s;
			setKamera("wl");
		} catch (e) {
			loguj("blad", { msg: "kamera", err: String(e) });
			setKamera("blad");
		}
	};

	const skanuj = async () => {
		for (let i = 0; i < ruchy.length; i++) {
			setEtap(i);
			await czekaj(1100);
		}
		dispatch({ typ: "krok", krok: "twarz" });
		setEtap(ruchy.length);
		strumien.current?.getTracks().forEach((t) => {
			t.stop();
		});
	};

	const ruch = ruchy[Math.max(0, Math.min(etap, ruchy.length - 1))];
	const obwod = 2 * Math.PI * 92;
	const postep = gotowe ? 1 : Math.max(0, etap) / ruchy.length;

	return (
		<Wymaga krokow={["logowanie", "dokument"]}>
			<NavBar tytul="Skan twarzy 3D" wstecz="/glosuj/dokument" />
			<div className="pad">
				<Stepper krok={2} />
				<div className="scan" style={{ height: 280 }}>
					<video ref={video} autoPlay playsInline muted hidden={kamera !== "wl" || gotowe} />
					<svg
						viewBox="0 0 220 220"
						width="220"
						height="220"
						aria-hidden="true"
						style={{ position: "relative" }}
					>
						<circle
							cx="110"
							cy="110"
							r="92"
							fill="none"
							stroke={kamera === "wl" ? "rgba(255,255,255,.6)" : "#e3e5eb"}
							strokeWidth="6"
						/>
						<circle
							className="face-ring"
							cx="110"
							cy="110"
							r="92"
							fill="none"
							stroke={gotowe ? "#2e7d32" : "#1f5fdc"}
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={obwod}
							strokeDashoffset={obwod * (1 - postep)}
							transform="rotate(-90 110 110)"
						/>
						{kamera !== "wl" && !gotowe && (
							<g
								className="face-head"
								style={{
									transform: `translate(${etap >= 0 ? ruch.dx : 0}px, ${etap >= 0 ? ruch.dy : 0}px)`,
								}}
								fill="none"
								stroke="#8a93a6"
								strokeWidth="3"
								strokeLinecap="round"
							>
								<ellipse cx="110" cy="102" rx="40" ry="50" />
								<path d="M96 96v6M124 96v6M110 102v14h-5M98 128s5 5 12 5 12-5 12-5" />
							</g>
						)}
						{gotowe && (
							<path
								d="m84 112 18 18 36-36"
								stroke="#2e7d32"
								strokeWidth="9"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						)}
					</svg>
				</div>
				<p className="scan-status" role="status">
					{gotowe
						? "Twarz zgodna ze zdjęciem z dowodu"
						: etap >= 0
							? ruch.tekst
							: "Ustaw twarz w okręgu"}
				</p>
				<p className="scan-sub">
					{kamera === "blad"
						? "Brak dostępu do kamery. Skan zadziała w trybie pokazowym, bez obrazu."
						: kamera === "wl"
							? "Obraz z kamery zostaje na tym urządzeniu."
							: "Kamera jest opcjonalna. Bez niej zobaczysz animację skanu."}
				</p>
				<div className="actions">
					{gotowe ? (
						<button
							type="button"
							className="btn primary"
							onClick={() => navigate({ to: "/glosuj/tozsamosc" })}
						>
							Dalej
						</button>
					) : (
						<>
							<button type="button" className="btn primary" disabled={etap >= 0} onClick={skanuj}>
								{etap >= 0 ? "Skanowanie…" : "Rozpocznij skan twarzy"}
							</button>
							{kamera === "wyl" && etap < 0 && (
								<button type="button" className="btn secondary" onClick={wlaczKamere}>
									Użyj kamery
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</Wymaga>
	);
}

export function Tozsamosc() {
	return (
		<Wymaga krokow={kolejnoscKrokow}>
			<NavBar tytul="Weryfikacja" wstecz="/glosuj/twarz" />
			<div className="pad">
				<div className="hero-icon ok">
					<Ok />
				</div>
				<h1 className="large-title">Tożsamość potwierdzona</h1>
				<div className="card">
					<div className="row field">
						<span className="l">Wyborca</span>
						<span className="v">
							{wyborca.imie} {wyborca.nazwisko}
						</span>
					</div>
					<div className="row field">
						<span className="l">Logowanie</span>
						<span className="v">Profil zaufany</span>
					</div>
					<div className="row field">
						<span className="l">Dokument</span>
						<span className="v">Dowód osobisty, odczyt chipu NFC</span>
					</div>
					<div className="row field">
						<span className="l">Biometria</span>
						<span className="v">Skan twarzy 3D zgodny</span>
					</div>
				</div>
				<div className="actions">
					<Link to="/glosuj/rodzaj" className="btn primary">
						Przejdź do głosowania
					</Link>
				</div>
			</div>
		</Wymaga>
	);
}

function OddanyZnacznik() {
	return (
		<span className="badge">
			<Ok />
			Głos oddany
		</span>
	);
}

export function Rodzaj() {
	const { stan, dispatch } = useStan();
	const navigate = useNavigate();
	const dostepne = wybory.filter((w) => !juzGlosowal(stan, w.id));
	const wybrane = stan.wyboryId && !juzGlosowal(stan, stan.wyboryId) ? stan.wyboryId : null;

	return (
		<Wymaga krokow={kolejnoscKrokow}>
			<NavBar tytul="Wybory" wstecz="/glosuj/tozsamosc" />
			<div className="pad">
				<Stepper krok={3} />
				<h1 className="large-title" style={{ fontSize: 28, lineHeight: "34px" }}>
					W których wyborach głosujesz?
				</h1>
				<fieldset style={{ border: 0, margin: 0, padding: 0 }}>
					<legend className="sr-only">Rodzaj wyborów</legend>
					{wybory.map((w) => {
						const oddany = juzGlosowal(stan, w.id);
						return (
							<label className="radio" key={w.id}>
								<input
									type="radio"
									name="wybory"
									value={w.id}
									checked={wybrane === w.id}
									disabled={oddany}
									onChange={() => dispatch({ typ: "wybierzWybory", id: w.id })}
								/>
								<span className="dot" />
								<span className="txt">
									<span className="t">{w.nazwa}</span>
									<span className="s">{w.data}</span>
								</span>
								{oddany && <OddanyZnacznik />}
							</label>
						);
					})}
				</fieldset>
				{dostepne.length === 0 && (
					<p className="empty">
						<b>Oddano głos we wszystkich wyborach</b>Historię znajdziesz w usłudze Wybory.
					</p>
				)}
				<div className="actions">
					<button
						type="button"
						className="btn primary"
						disabled={!wybrane}
						onClick={() => navigate({ to: "/glosuj/karta" })}
					>
						Dalej
					</button>
				</div>
			</div>
		</Wymaga>
	);
}

function Opcja({ id, tytul, podpis }: { id: string; tytul: string; podpis?: string }) {
	const { stan, dispatch } = useStan();
	return (
		<label className="radio">
			<input
				type="radio"
				name="opcja"
				value={id}
				checked={stan.opcjaId === id}
				onChange={() => dispatch({ typ: "wybierzOpcje", id })}
			/>
			<span className="dot" />
			<span className="txt">
				<span className="t">{tytul}</span>
				{podpis && <span className="s">{podpis}</span>}
			</span>
		</label>
	);
}

function Opcje({ w }: { w: Wybory }) {
	if (w.typ === "referendum") {
		return (
			<>
				<p className="prose" style={{ fontWeight: 600, fontSize: 18, lineHeight: "25px" }}>
					{w.pytanie}
				</p>
				<Opcja id="tak" tytul="TAK" />
				<Opcja id="nie" tytul="NIE" />
			</>
		);
	}
	if (w.typ === "jeden") {
		return (
			<>
				<p className="lead">Zaznacz jednego kandydata.</p>
				{w.kandydaci.map((c) => (
					<Opcja key={c.id} id={c.id} tytul={`${c.nazwisko} ${c.imie}`} podpis={c.opis} />
				))}
			</>
		);
	}
	return (
		<>
			<p className="lead">
				{w.okreg}. Zaznacz jednego kandydata z jednej listy. Głos liczy się dla kandydata i jego
				listy.
			</p>
			{w.komitety.map((kom) => (
				<section key={kom.id}>
					<h2 className="komitet">
						Lista nr {kom.numer} <b>{kom.nazwa}</b>
					</h2>
					{kom.kandydaci.map((c, i) => (
						<Opcja
							key={c.id}
							id={c.id}
							tytul={`${i + 1}. ${c.nazwisko} ${c.imie}`}
							podpis={c.opis}
						/>
					))}
				</section>
			))}
		</>
	);
}

export function Karta() {
	const { stan } = useStan();
	const navigate = useNavigate();
	const w = stan.wyboryId ? znajdzWybory(stan.wyboryId) : undefined;

	if (!w) return <Navigate to="/glosuj/rodzaj" replace />;
	if (juzGlosowal(stan, w.id)) return <Navigate to="/glosuj/rodzaj" replace />;

	return (
		<Wymaga krokow={kolejnoscKrokow}>
			<NavBar tytul="Karta do głosowania" wstecz="/glosuj/rodzaj" />
			<div className="pad">
				<Stepper krok={3} />
				<h1 className="section-h" style={{ fontSize: 22, lineHeight: "28px", marginTop: 0 }}>
					{w.nazwa}
				</h1>
				<fieldset style={{ border: 0, margin: 0, padding: 0 }}>
					<legend className="sr-only">Twój wybór</legend>
					<Opcje w={w} />
				</fieldset>
				<div className="actions">
					<button
						type="button"
						className="btn primary"
						disabled={!stan.opcjaId}
						onClick={() => navigate({ to: "/glosuj/potwierdzenie" })}
					>
						Dalej
					</button>
				</div>
			</div>
		</Wymaga>
	);
}

export function Potwierdzenie() {
	const { stan, dispatch } = useStan();
	const navigate = useNavigate();
	const [zapis, setZapis] = useState<"nie" | "trwa" | "blad">("nie");
	const w = stan.wyboryId ? znajdzWybory(stan.wyboryId) : undefined;
	const wybor = w && stan.opcjaId ? opisWyboru(w, stan.opcjaId) : undefined;

	if (!mfaKompletne(stan)) return <Navigate to="/glosuj/logowanie" replace />;
	const oddany = w && stan.historia.find((h) => h.wyboryId === w.id);
	if (oddany) return <Navigate to="/glosuj/oddany" search={{ tx: oddany.tx }} replace />;
	if (!w || !wybor) return <Navigate to="/glosuj/rodzaj" replace />;

	const oddaj = async () => {
		setZapis("trwa");
		try {
			const [p] = await Promise.all([zapiszGlos(w.id, wybor.opcjaId), czekaj(900)]);
			dispatch({ typ: "oddano", pokwitowanie: p });
			navigate({ to: "/glosuj/oddany", search: { tx: p.tx }, replace: true });
		} catch (e) {
			loguj("blad", { msg: "zapis głosu", err: String(e) });
			setZapis("blad");
		}
	};

	return (
		<>
			<NavBar tytul="Potwierdzenie" wstecz="/glosuj/karta" />
			<div className="pad">
				<Stepper krok={4} />
				<h1 className="large-title" style={{ fontSize: 28, lineHeight: "34px" }}>
					Sprawdź swój wybór
				</h1>
				<div className="card">
					<div className="row field">
						<span className="l">Wybory</span>
						<span className="v">{w.nazwa}</span>
					</div>
					<div className="row field">
						<span className="l">Twój głos</span>
						<span className="v" style={{ fontSize: 24, lineHeight: "30px" }}>
							{wybor.etykieta}
						</span>
						{wybor.podpis && <span className="l">{wybor.podpis}</span>}
					</div>
				</div>
				<p className="lead" style={{ marginTop: 16 }}>
					Po oddaniu głosu nie da się go zmienić. Zapis dostanie identyfikator, po którym
					sprawdzisz, że głos został policzony.
				</p>
				{zapis === "blad" && (
					<p className="lead error" role="alert">
						Nie udało się zapisać głosu. Twój wybór jest zachowany, spróbuj jeszcze raz.
					</p>
				)}
				<div className="actions">
					<button type="button" className="btn primary" disabled={zapis === "trwa"} onClick={oddaj}>
						{zapis === "trwa" ? "Zapisywanie głosu…" : "Oddaj głos"}
					</button>
					<Link
						to="/glosuj/karta"
						className="btn secondary"
						aria-disabled={zapis === "trwa" || undefined}
					>
						Zmień wybór
					</Link>
				</div>
			</div>
		</>
	);
}

export function Oddany({ tx }: { tx?: string }) {
	const { stan } = useStan();
	const p = stan.historia.find((h) => h.tx === tx);
	if (!p) return <Navigate to="/uslugi/wybory" replace />;
	const w = znajdzWybory(p.wyboryId);

	return (
		<div className="pad" style={{ paddingTop: 24 }}>
			<div className="hero-icon ok">
				<Ok />
			</div>
			<h1 className="large-title">Głos oddany</h1>
			<p className="lead">{w?.nazwa}. Dziękujemy za udział w wyborach.</p>
			<h2 className="section-h" style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<Lancuch width={22} height={22} style={{ color: "var(--accent)" }} />
				Zapis w rejestrze głosów
			</h2>
			<div className="card">
				<div className="row field">
					<span className="l">Skrót głosu (SHA-256)</span>
					<span className="v mono">{p.hash}</span>
				</div>
				<div className="row field">
					<span className="l">Identyfikator zapisu</span>
					<span className="v mono">{p.tx}</span>
				</div>
				<div className="row field" data-zmienne>
					<span className="l">Czas</span>
					<span className="v">{new Date(p.czas).toLocaleString("pl-PL")}</span>
				</div>
			</div>
			<p className="lead" style={{ marginTop: 16, fontSize: 14 }}>
				Symulacja. Skrót liczy się w Twojej przeglądarce i nigdzie nie jest wysyłany. Skrót nie
				zawiera treści głosu.
			</p>
			<div className="actions">
				<Link to="/uslugi/wybory/historia" className="btn primary">
					Historia głosowań
				</Link>
				<Link to="/uslugi/wybory" className="btn secondary">
					Wróć do usługi Wybory
				</Link>
			</div>
		</div>
	);
}
