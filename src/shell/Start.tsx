import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// ?demo=off wyłącza autologowanie i pokazuje ekran startowy, np. do nagrań.
const demoOff = () => {
	const q = new URLSearchParams(window.location.search);
	return q.get("demo") === "off";
};

const FaceIdSkan = () => (
	<svg
		className="scanning"
		viewBox="0 0 48 48"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.4"
		strokeLinecap="round"
		aria-hidden="true"
	>
		<path d="M6 15V10a4 4 0 0 1 4-4h5M33 6h5a4 4 0 0 1 4 4v5M42 33v5a4 4 0 0 1-4 4h-5M15 42h-5a4 4 0 0 1-4-4v-5M17 18v3M31 18v3M24 18v8h-2M18 32s2.4 2.6 6 2.6 6-2.6 6-2.6" />
	</svg>
);
const FaceIdOk = () => (
	<svg
		className="done"
		viewBox="0 0 48 48"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.6"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<circle cx="24" cy="24" r="18" />
		<path d="m16 24.5 5.5 5.5L32 19" />
	</svg>
);

export function Start() {
	const navigate = useNavigate();
	const [faza, setFaza] = useState<"start" | "skan" | "ok">(() => (demoOff() ? "start" : "skan"));

	useEffect(() => {
		if (faza === "skan") {
			const t = window.setTimeout(() => setFaza("ok"), 900);
			return () => window.clearTimeout(t);
		}
		if (faza === "ok") {
			const t = window.setTimeout(() => navigate({ to: "/uslugi", replace: true }), 450);
			return () => window.clearTimeout(t);
		}
	}, [faza, navigate]);

	return (
		<div className="splash">
			<div className="mark">
				<i aria-hidden="true">e</i>
				<span>e-głosowanie, prototyp</span>
			</div>
			<h1 className="large-title" style={{ margin: 0 }}>
				Dzień dobry!
			</h1>
			<p className="lead" style={{ margin: "8px 0 0" }}>
				{faza === "start" ? "Zaloguj się do aplikacji." : "Logowanie…"}
			</p>
			{faza === "start" ? (
				<div className="actions">
					<button type="button" className="btn primary" onClick={() => setFaza("skan")}>
						Zaloguj się
					</button>
				</div>
			) : (
				<div className="faceid" role="status">
					{faza === "ok" ? <FaceIdOk /> : <FaceIdSkan />}
					<span>{faza === "ok" ? "Zalogowano" : "Face ID"}</span>
				</div>
			)}
		</div>
	);
}
