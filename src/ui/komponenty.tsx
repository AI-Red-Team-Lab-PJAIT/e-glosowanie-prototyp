import { Link, useRouter } from "@tanstack/react-router";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Chevron, Wstecz, Zamknij } from "./ikony";

export function NavBar({
	tytul,
	wstecz,
	prawa,
}: {
	tytul?: string;
	wstecz?: string;
	prawa?: ReactNode;
}) {
	const router = useRouter();
	return (
		<div className="navbar">
			{wstecz ? (
				<Link to={wstecz} className="back">
					<Wstecz />
					Wróć
				</Link>
			) : (
				<button type="button" className="back" onClick={() => router.history.back()}>
					<Wstecz />
					Wróć
				</button>
			)}
			{tytul ? <h1>{tytul}</h1> : <span />}
			{prawa ?? <span />}
		</div>
	);
}

export function Stepper({ krok, z = 4 }: { krok: number; z?: number }) {
	return (
		<div className="stepper">
			<span>
				{krok} z {z}
			</span>
			<div className="bars" aria-hidden="true">
				{Array.from({ length: z }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: stała liczba pasków
					<i key={i} className={i < krok ? "on" : undefined} />
				))}
			</div>
		</div>
	);
}

type RowProps = {
	tytul: string;
	podpis?: string;
	ikona?: ReactNode;
	chevron?: boolean;
	regular?: boolean;
};

function RowInner({ tytul, podpis, ikona, chevron = true, regular }: RowProps) {
	return (
		<>
			{ikona}
			<span className="txt">
				<span className={regular ? "t regular" : "t"}>{tytul}</span>
				{podpis && <span className="s">{podpis}</span>}
			</span>
			{chevron && <Chevron className="chev" />}
		</>
	);
}

export function RowLink({
	to,
	params,
	...p
}: RowProps & { to: string; params?: Record<string, string> }) {
	return (
		<Link to={to} params={params} className="row">
			<RowInner {...p} />
		</Link>
	);
}

export function RowButton({
	onClick,
	disabled,
	...p
}: RowProps & { onClick: () => void; disabled?: boolean }) {
	return (
		<button type="button" className="row" onClick={onClick} aria-disabled={disabled || undefined}>
			<RowInner {...p} />
		</button>
	);
}

// Toast
const ToastCtx = createContext<(t: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
	const [tekst, setTekst] = useState<string | null>(null);
	const timer = useRef<number>(undefined);
	const pokaz = useCallback((t: string) => {
		setTekst(t);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setTekst(null), 2400);
	}, []);
	return (
		<ToastCtx.Provider value={pokaz}>
			{children}
			<div role="status" aria-live="polite" className={tekst ? "toast" : "sr-only"}>
				{tekst}
			</div>
		</ToastCtx.Provider>
	);
}

export const useToast = () => useContext(ToastCtx);
export const NIEDOSTEPNE = "Niedostępne w prototypie";

// Arkusz z dołu, zamykany Escape, kliknięciem w tło albo przyciskiem.
export function Sheet({
	tytul,
	onClose,
	children,
}: {
	tytul: string;
	onClose: () => void;
	children: ReactNode;
}) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const poprzedni = document.activeElement as HTMLElement | null;
		ref.current?.focus();
		const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", esc);
		return () => {
			window.removeEventListener("keydown", esc);
			poprzedni?.focus();
		};
	}, [onClose]);
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tło zamyka arkusz, klawiatura ma Escape i przycisk
		// biome-ignore lint/a11y/useKeyWithClickEvents: jw.
		<div className="sheet-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div
				ref={ref}
				className="sheet"
				role="dialog"
				aria-modal="true"
				aria-label={tytul}
				tabIndex={-1}
			>
				<div className="grab" />
				<header>
					<h2>{tytul}</h2>
					<button type="button" className="icon-btn" onClick={onClose} aria-label="Zamknij">
						<Zamknij />
					</button>
				</header>
				{children}
			</div>
		</div>
	);
}
