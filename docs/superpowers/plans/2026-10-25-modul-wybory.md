# e-glosowanie-prototyp: moduł „Wybory” w stylu mObywatela

## Context
Koło AI Red Team Lab chce pokazać koncepcję głosowania w mObywatelu: logowanie, MFA (skan dokumentu NFC, skan twarzy 3D), karta do głosowania, zapis głosu „na blockchainie”, historia. Ma to być klikalny prototyp frontendowy z podglądem na żywo (GitHub Pages) w publicznym repo organizacji `AI-Red-Team-Lab-PJAIT`. Wymagania z rozmowy:
- wygląd jak najbliżej prawdziwej aplikacji (zakładka Usługi → Wybory, ekran „Masz czynne prawo wyborcze”),
- autologowanie w podglądzie (bez PIN-u, od razu do Usług),
- pozostałe usługi widoczne, ale wygaszone (nieaktywne w prototypie).

Ustalenia z rozpoznania:
- **Prawdziwego kodu mObywatela nie da się pobrać.** MC opublikowało w BIP tylko fragmenty UI, do oglądania po zalogowaniu, bez repo i bez jasnej licencji.
- **mobywatel.ai** (prototyp Janusza Cieszyńskiego) ma ZIP na **licencji MIT** (pobrany do scratchpada, przejrzany). To czat z asystentem AI, bez zakładki Usługi i bez modułu Wybory, ale ma gotowe elementy: ramkę telefonu, status bar, tokeny kolorów (`--bg:#f2f3f7`, `--surface:#fff`, `--ink:#111216` …), stack fontów, ikony SVG, animację Face ID. Licencja MIT **nie obejmuje** godła, logo i oznaczeń mObywatela, grafik dokumentów ani zdjęć osób, więc tych plików nie bierzemy.
- Oficjalna strona info.mobywatel.gov.pl/uslugi/wybory to SPA (treść nie wychodzi w curl). Opis usługi: czynne prawo wyborcze, obwód i adres lokalu, dane w CRW, dodanie do kalendarza, nawigacja.
- Konwencje organizacji: `CLAUDE.md` + `PRODUCT.md` + `DESIGN.md` w roocie, specy/plany w `docs/superpowers/{specs,plans}/RRRR-MM-DD-*.md`, Biome, pnpm, `.nvmrc`, workflowy `ci.yml` + `deploy.yml`, opisy po polsku. Design system Koła (`design-system`) jest od marki Koła, więc tu go nie stosujemy, bo UI ma udawać mObywatel. Używamy go tylko na stronie „O projekcie”.

## Podejście
Stack: React 19 + Vite + TypeScript + Tailwind v4 + Biome, jak w `pja-ai-red-team-lab-website`. Routing przez HashRouter (TanStack Router z hash history), żeby Pages działało bez rewrite'ów. Stan w pamięci + `localStorage` (historia głosów), bez backendu.

### 1. Referencje wizualne (przed kodem)
- Otworzyć w przeglądarce (claude-in-chrome) info.mobywatel.gov.pl/uslugi/wybory i inne publiczne źródła (artykuły z instrukcjami ze screenami: antyweb, interia, gdynia.pl, bezpiecznewybory.pl), zebrać zrzuty ekranów Usług i Wyborów.
- Zrzuty trzymamy lokalnie w `docs/referencje/` **poza gitem** (`.gitignore`), bo to cudze obrazy. Do repo trafia tylko opis pomiarów w `DESIGN.md`: odstępy, promienie, rozmiary fontów, kolory, wygląd tab bara i kart.
- Wzorzec ekranu „Wybory” to screen od użytkownika (Image #2): duży tytuł 34/bold, karty białe z promieniem ok. 16, nagłówki sekcji, chevron, tab bar z 4 pozycjami (Dokumenty / Usługi / Kod QR / Więcej), aktywna pozycja niebieska.

### 2. Struktura repo
```
e-glosowanie-prototyp/
├─ CLAUDE.md          # kontekst dla agentów: cel, zasady (bez godła, bez prawdziwych danych), komendy
├─ PRODUCT.md         # pomysł, flow 11 ekranów, otwarte dziury (malware, tajność, kupowanie głosów)
├─ DESIGN.md          # tokeny i pomiary komponentów odtworzone z referencji
├─ README.md          # link do podglądu, uruchomienie, zastrzeżenie „to nie jest aplikacja rządowa”
├─ LICENSE            # MIT (nasz kod)
├─ THIRD_PARTY.md     # MIT notice mobywatel.ai (J. Cieszyński) dla przejętych fragmentów
├─ docs/superpowers/specs/2026-10-25-modul-wybory-design.md
├─ docs/superpowers/plans/2026-10-25-modul-wybory.md
├─ .github/workflows/ci.yml       # biome check, tsc, vitest, playwright
├─ .github/workflows/deploy.yml   # build → actions/deploy-pages po zielonym CI na main
├─ src/
│  ├─ ui/             # odtworzone komponenty: PhoneFrame, StatusBar, NavBar (Wróć + tytuł), LargeTitle,
│  │                  # SectionHeader, ListCard/ListRow (chevron), PrimaryButton, SecondaryButton,
│  │                  # RadioCard, Stepper „1 z 4”, TabBar, SuccessBadge, Sheet
│  ├─ shell/          # AutoLogin, ekran Usługi (lista modułów, wygaszone), tab bar
│  ├─ wybory/         # 11 ekranów flow + typy wyborów (prezydenckie, sejm/senat, PE, referendum)
│  ├─ data/           # fikcyjne: osoba, wybory, kandydaci, komitety, obwód
│  └─ ledger/         # mock „blockchain”: hash głosu (SHA-256 przez WebCrypto), fikcyjny tx id
└─ tests/
   ├─ unit/           # vitest: logika flow, ledger, reducer stanu
   └─ e2e/            # playwright: pełny flow + screenshoty
```

### 3. Autologowanie i wygaszone moduły
- Start aplikacji → krótki ekran „Logowanie…” z animacją Face ID (z mobywatel.ai, ok. 1 s) → od razu zakładka **Usługi**. Bez pól PIN/hasło (nic nie zbieramy).
- Ekran Usługi: pełna lista jak w aplikacji (Twoje dane, Pojazdy i prawo jazdy, Rodzina, Zdrowie, Wybory …). Wszystko poza **Wybory** ma `opacity` ok. 0.4, `aria-disabled`, a tapnięcie pokazuje toast „Niedostępne w prototypie”. Zakładki Dokumenty / Kod QR / Więcej działają tak samo (wygaszone).
- Flaga `?demo=off` wyłącza autologin i pokazuje ekran startowy. Przyda się do nagrań.

### 4. Flow Wyborów (wg makiety Image #3)
1. Usługi → Wybory („Masz czynne prawo wyborcze”, Zaplanowane wybory, Twoje dane w rejestrze) + przycisk „Zagłosuj”
2. Logowanie: Profil zaufany / Twój bank. Atrapy przycisków, klik od razu przechodzi dalej, bez pól.
3. Skan dokumentu (1 z 4): animacja przyłożenia telefonu do dowodu (NFC)
4. Skan twarzy 3D (2 z 4): kamera opcjonalnie (`getUserMedia`, obraz zostaje lokalnie), inaczej sylwetka z mobywatel.ai + sekwencja „w lewo → w prawo → w górę”
5. Tożsamość potwierdzona
6. Wybór rodzaju wyborów (RadioCard)
7. Karta do głosowania. Warianty: jeden kandydat / lista komitetów z kandydatami / referendum TAK-NIE.
8. Potwierdzenie wyboru („Oddaj głos” / „Zmień wybór”)
9. Głos oddany + karta „Blockchain” (hash, fikcyjny nr transakcji)
10. Historia głosowań (z `localStorage`)

Plus strona „O projekcie” (styl Koła): opis koncepcji MFA + smart kontrakt i otwarte problemy (malware na telefonie, tajność głosu, przymus/kupowanie głosów). Wyraźnie podpisane jako otwarte, nie rozwiązane.

### 5. Zasady bezpieczeństwa / prawne (do CLAUDE.md)
- Bez godła RP, logo i nazwy „mObywatel” jako znaku. Zamiast tego neutralna ikona i podpis „Prototyp koncepcyjny AI Red Team Lab PJATK”. Stały baner na górze podglądu: „To nie jest aplikacja rządowa. Dane fikcyjne.” Strona nie może działać jak prawdziwy mObywatel.
- Żadnych pól na prawdziwe dane, login czy hasło. Kamera tylko lokalnie, nic nie wysyłamy.
- `<meta name="robots" content="noindex">`.

### 6. „Evy”, czyli jak sprawdzamy jakość
To frontend bez modelu AI, więc evale to testy:
- **Unit (vitest):** przejścia flow, nie da się oddać głosu bez MFA, jeden głos na wybory, hash ledgera deterministyczny.
- **E2E (playwright, viewport iPhone 15):** przejście całego flow dla każdego typu wyborów, test, że wygaszone moduły nie nawigują.
- **Wizualne:** `toHaveScreenshot` dla każdego ekranu (regresja). Dodatkowo ręczne porównanie obok referencji z `docs/referencje/` przy dopracowywaniu komponentów.
- **A11y:** `@axe-core/playwright` na każdym ekranie.

### 7. Repo i Pages
1. `gh repo create AI-Red-Team-Lab-PJAIT/e-glosowanie-prototyp --public --description "…"`
2. Lokalnie w `/Users/david/CodingProjects/mObywatel-ai`: `git init`, scaffold, pierwszy commit na `main`, push.
3. `gh api -X POST repos/AI-Red-Team-Lab-PJAIT/e-glosowanie-prototyp/pages -f build_type=workflow` (Pages ze źródła GitHub Actions). W Vite `base: '/e-glosowanie-prototyp/'`.
4. Podgląd: `https://ai-red-team-lab-pjait.github.io/e-glosowanie-prototyp/`

## Weryfikacja
- `pnpm biome check && pnpm tsc --noEmit && pnpm test && pnpm e2e`, wszystko na zielono lokalnie i w CI.
- Po deployu otworzyć URL Pages na telefonie i w przeglądarce. Sprawdzić autologin → Usługi → Wybory → pełny flow → Historia, wygaszone moduły, baner, brak godła/logo.
- Porównać screeny z Playwrighta z referencją (Image #2) obok siebie i poprawić rozjazdy w odstępach i typografii.

## Źródła
- mobywatel.ai, ZIP prototypu (MIT, wyłączenia w README)
- instalki.pl / spidersweb.pl / antyweb.pl o publikacji kodu mObywatela w BIP (tylko UI, bez repo)
- info.mobywatel.gov.pl/uslugi/wybory (opis usługi)

## Odstępstwa w trakcie realizacji (2026-10-25)

- Bez pusha i bez GitHub Pages, dopóki autor nie obejrzy wersji lokalnej.
- Podgląd to sama aplikacja: na laptopie ramka iPhone 14 Pro z devices.css (MIT), na telefonie pełny ekran. Pasek ostrzegawczy i „O projekcie” są wewnątrz aplikacji, nie na osobnej stronie w stylu Koła.
- Wzory wyglądu: oficjalne grafiki usługi Wybory z API info.mobywatel.gov.pl i zrzut listy usług z antyweb.pl (lokalnie, poza gitem).
- mobywatel.ai nie ma sylwetki twarzy (tylko pojazdy), więc rysunek do skanu twarzy jest nasz.
- Kod źródłowy iOS na mobywatel.gov.pl wymaga logowania, nie korzystamy z niego.
- Dodany dziennik debugowania (konsola i `debug/sesja.jsonl`).
