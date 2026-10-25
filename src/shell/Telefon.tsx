import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TabDokumenty, TabKodQr, TabUslugi, TabWiecej } from "../ui/ikony";
import { NIEDOSTEPNE, ToastProvider, useToast } from "../ui/komponenty";

function Zegar() {
	const [czas, setCzas] = useState(() => new Date());
	useEffect(() => {
		const t = window.setInterval(() => setCzas(new Date()), 30_000);
		return () => window.clearInterval(t);
	}, []);
	return <span>{czas.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>;
}

function StatusBar() {
	return (
		<div className="status" aria-hidden="true">
			<Zegar />
			<span className="sig">
				<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
					<rect x="0" y="7" width="3" height="4" rx=".8" />
					<rect x="4.6" y="4.8" width="3" height="6.2" rx=".8" />
					<rect x="9.2" y="2.4" width="3" height="8.6" rx=".8" />
					<rect x="13.8" y="0" width="3" height="11" rx=".8" />
				</svg>
				<svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
					<path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.3 10.3 0 0 0 8 .5 10.3 10.3 0 0 0 .9 3.4L2 4.6a8.6 8.6 0 0 1 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.9 6.9 0 0 0 8 3.9a6.9 6.9 0 0 0-4.7 1.9L4.4 7A5.2 5.2 0 0 1 8 5.6Zm0 3.3a1.6 1.6 0 0 1 1.2.5L8 10.6 6.8 9.4A1.6 1.6 0 0 1 8 8.9Z" />
				</svg>
				<i className="bat" />
			</span>
		</div>
	);
}

function TabBar() {
	const toast = useToast();
	const off = (label: string, Ikona: typeof TabDokumenty) => (
		<button type="button" className="tab" aria-disabled="true" onClick={() => toast(NIEDOSTEPNE)}>
			<Ikona />
			{label}
		</button>
	);
	return (
		<nav className="tabbar" aria-label="Główne">
			{off("Dokumenty", TabDokumenty)}
			<Link to="/uslugi" className="tab" aria-current="page">
				<TabUslugi />
				Usługi
			</Link>
			{off("Kod QR", TabKodQr)}
			{off("Więcej", TabWiecej)}
		</nav>
	);
}

export function Telefon() {
	const sciezka = useRouterState({ select: (s) => s.location.pathname });
	const ekran = useRef<HTMLDivElement>(null);
	const zTabBarem = sciezka.startsWith("/uslugi") || sciezka === "/o-projekcie";

	const naTelefonie = useNaTelefonie();
	const skala = useSkala();

	// Każdy nowy ekran zaczyna od góry, jak przy nawigacji w aplikacji.
	// biome-ignore lint/correctness/useExhaustiveDependencies: reagujemy tylko na zmianę ścieżki
	useEffect(() => {
		ekran.current?.scrollTo(0, 0);
	}, [sciezka]);

	const aplikacja = (
		<div className="phone">
			{!naTelefonie && <StatusBar />}
			<ToastProvider>
				<div className="banner">
					<p>Prototyp Koła AI Red Team Lab. To nie jest aplikacja rządowa, dane są fikcyjne.</p>
					{sciezka !== "/o-projekcie" && <Link to="/o-projekcie">O projekcie</Link>}
				</div>
				<main className="screen" ref={ekran}>
					<Outlet />
				</main>
				{zTabBarem && <TabBar />}
			</ToastProvider>
			{!naTelefonie && <div className="homebar" />}
		</div>
	);

	if (naTelefonie) return aplikacja;

	// Ramka iPhone 14 Pro z devices.css (MIT, picturepan2).
	return (
		<div className="stage">
			<div className="device device-iphone-14-pro device-black" style={{ zoom: skala }}>
				<div className="device-frame">
					<div className="device-screen">{aplikacja}</div>
				</div>
				<div className="device-stripe" />
				<div className="device-header" />
				<div className="device-sensors" />
				<div className="device-btns" />
				<div className="device-power" />
				<div className="device-home" />
			</div>
		</div>
	);
}

const WYSOKOSC_RAMKI = 868;

// Telefon w ramce mieści się w oknie laptopa z marginesem i nie jest większy niż 90%.
const liczSkale = () => Math.min(0.9, (window.innerHeight - 40) / WYSOKOSC_RAMKI);

function useSkala() {
	const [skala, setSkala] = useState(liczSkale);
	useEffect(() => {
		const r = () => setSkala(liczSkale());
		window.addEventListener("resize", r);
		return () => window.removeEventListener("resize", r);
	}, []);
	return skala;
}

function useNaTelefonie() {
	const mq = "(max-width: 520px)";
	const [tak, setTak] = useState(() => window.matchMedia(mq).matches);
	useEffect(() => {
		const m = window.matchMedia(mq);
		const r = () => setTak(m.matches);
		m.addEventListener("change", r);
		return () => m.removeEventListener("change", r);
	}, []);
	return tak;
}
