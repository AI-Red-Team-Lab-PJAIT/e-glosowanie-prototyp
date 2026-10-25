# e-głosowanie: prototyp

Klikalny prototyp głosowania przez internet w stylu usługi Wybory z mObywatela. Projekt Koła Naukowego AI Red Team Lab PJATK. Sam frontend, bez backendu.

Podgląd: https://ai-red-team-lab-pjait.github.io/e-glosowanie-prototyp/
Repo: https://github.com/AI-Red-Team-Lab-PJAIT/e-glosowanie-prototyp
Wdrożenie: push na `main` → CI (`ci.yml`) → po zielonym CI `deploy.yml` publikuje na Pages. Nie wdrażamy ręcznie poza `gh workflow run deploy.yml`.

Stack: React 19, Vite, TypeScript, TanStack Router (hash history), Biome, Vitest, Playwright. Style w `src/styles.css` (tokeny w `:root`).

## Komendy

- `pnpm dev`: podgląd na http://localhost:5173 (`pnpm dev --host` udostępnia w sieci lokalnej)
- `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm e2e`
- `pnpm e2e --update-snapshots`: odświeża wzorcowe zrzuty po zamierzonej zmianie wyglądu

## Mapa projektu

Zacznij od `PRODUCT.md` (przepływ), potem `src/router.tsx` (lista wszystkich ekranów i ich adresów).

- `src/main.tsx`: wejście, providery (stan, toasty), router.
- `src/router.tsx`: trasy. `/` start z Face ID, `/uslugi`, `/uslugi/wybory/...` (lista, szczegóły, rejestr, historia), `/glosuj/...` (logowanie, dokument, twarz, tożsamość, rodzaj, karta, potwierdzenie, oddany), `/o-projekcie`.
- `src/shell/`: obudowa. `Telefon.tsx` (ramka iPhone'a na laptopie, pełny ekran na telefonie, pasek „To nie jest aplikacja rządowa”), `Start.tsx` (autologowanie), `Uslugi.tsx` (lista usług).
- `src/wybory/Wybory.tsx`: ekrany usługi Wybory. `src/wybory/Glosowanie.tsx`: cały przepływ głosowania z MFA.
- `src/state/stan.ts`: reducer (`Stan`, `Akcja`, kroki MFA). `StanProvider.tsx`: kontekst, `useStan()`, historia w `localStorage`.
- `src/ledger/ledger.ts`: SHA-256 z solą (z zapasem w JS dla http), `zapiszGlos`, `Pokwitowanie`.
- `src/data/fikcja.ts`: zmyślone wybory, kandydaci, dane wyborcy.
- `src/ui/`: wspólne komponenty (`NavBar`, `Stepper`, `RowLink`, `Sheet`, toasty) i ikony.
- `src/debug/dziennik.ts`: dziennik `[e-gl]`. W dev zapis do `debug/sesja.jsonl`; przy błędach czytaj ten plik.
- `src/styles.css`: wszystkie style, tokeny w `:root`.
- `tests/unit/`: Vitest (reducer, skróty). `tests/e2e/flow.spec.ts`: Playwright, pełne przepływy, axe, zrzuty w `tests/e2e/__screenshots__/`.
- `.github/workflows/`: `ci.yml` i `deploy.yml`.

Nowy ekran: komponent w `src/wybory/` albo `src/shell/`, trasa w `src/router.tsx`, test w `tests/e2e/flow.spec.ts`. Po zmianie wyglądu `pnpm e2e --update-snapshots` i obejrzyj nowe zrzuty.

## Zasady, których nie łamiemy

- Bez godła RP, logo i nazwy mObywatela jako znaku. Bez grafik z aplikacji. Zrzuty referencyjne leżą tylko lokalnie w `docs/referencje/` (gitignore).
- Żadnych pól na prawdziwe dane, loginy ani hasła. Kamera działa lokalnie, nic nie wysyłamy.
- Stały pasek „To nie jest aplikacja rządowa, dane są fikcyjne” i `noindex`.
- Dane w `src/data/fikcja.ts` są zmyślone i tak mają zostać.
- Historia głosów nie przechowuje treści głosu.

## Pliki projektu

- `PRODUCT.md`: pomysł, przepływ, otwarte problemy
- `DESIGN.md`: tokeny i pomiary z referencji
- `BACKLOG.md`: co jest otwarte. Aktualizuj po każdej sesji.
- `CHANGELOG.md`: co się zmieniło. Dopisuj na bieżąco.
- `AGENTS.md`: kopia tego pliku dla innych modeli. Zmieniasz zasady tutaj, zmień też tam.
