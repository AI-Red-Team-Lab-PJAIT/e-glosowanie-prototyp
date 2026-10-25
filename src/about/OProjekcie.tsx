import { Link } from "@tanstack/react-router";

export function OProjekcie() {
	return (
		<div className="pad" style={{ paddingTop: 16 }}>
			<h1 className="large-title">O projekcie</h1>
			<div className="prose">
				<p>
					To klikalny prototyp, w którym Koło Naukowe AI Red Team Lab PJATK sprawdza, jak mogłoby
					wyglądać głosowanie przez internet w usłudze Wybory. Nie jest to aplikacja rządowa ani jej
					część. Wszystkie osoby, komitety i adresy są zmyślone.
				</p>

				<h2>Co pokazuje</h2>
				<p>
					Zanim oddasz głos, przechodzisz trzy potwierdzenia: logowanie (Profil zaufany albo bank),
					odczyt chipu dowodu osobistego przez NFC i skan twarzy 3D porównany ze zdjęciem z dowodu.
					Potem wybierasz wybory, zaznaczasz kandydata albo odpowiedź w referendum i potwierdzasz.
				</p>
				<p>
					Głos dostaje skrót SHA-256 z losową solą i identyfikator zapisu, jakby trafiał do
					publicznego rejestru opartego na blockchainie. W prototypie skrót liczy się w przeglądarce
					i nigdzie nie wychodzi. Kamera, jeśli ją włączysz, też działa tylko lokalnie.
				</p>

				<h2>Problemy, których ten prototyp nie rozwiązuje</h2>
				<ul>
					<li>
						<span className="open">Otwarte.</span> Złośliwe oprogramowanie na telefonie może pokazać
						jeden wybór, a wysłać inny. Potwierdzenie na tym samym ekranie niczego tu nie
						gwarantuje.
					</li>
					<li>
						<span className="open">Otwarte.</span> Tajność głosu. Serwer, który sprawdza tożsamość,
						nie powinien móc powiązać jej z treścią głosu. Skrót z solą to za mało, potrzebny jest
						np. ślepy podpis albo mixnet.
					</li>
					<li>
						<span className="open">Otwarte.</span> Przymus i kupowanie głosów. W domu ktoś może stać
						obok i patrzeć. Lokal wyborczy ma kabinę, telefon jej nie ma. Jednym z pomysłów jest
						możliwość ponownego głosowania, gdzie liczy się ostatni głos.
					</li>
					<li>
						<span className="open">Otwarte.</span> Blockchain pokazuje, że zapis się nie zmienił.
						Nie dowodzi, że zapisano to, co wyborca zaznaczył.
					</li>
				</ul>
				<p>
					Te punkty są celem ćwiczeń red teamu: szukamy, jak złamać każdy krok, zanim ktokolwiek
					uzna go za bezpieczny.
				</p>

				<h2>Kod i licencje</h2>
				<p>
					Ramka telefonu, status bar i animacja Face ID są wzorowane na prototypie mobywatel.ai
					Janusza Cieszyńskiego (licencja MIT). Nie używamy godła, logo ani grafik aplikacji
					mObywatel.
				</p>
				<p>
					Kod źródłowy:{" "}
					<a
						href="https://github.com/AI-Red-Team-Lab-PJAIT/e-glosowanie-prototyp"
						target="_blank"
						rel="noreferrer"
					>
						github.com/AI-Red-Team-Lab-PJAIT/e-glosowanie-prototyp
					</a>
					.
				</p>
			</div>
			<div className="actions">
				<Link to="/uslugi/wybory" className="btn primary">
					Przejdź do usługi Wybory
				</Link>
			</div>
		</div>
	);
}
