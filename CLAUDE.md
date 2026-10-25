# e-głosowanie: prototyp

Klikalny prototyp głosowania przez internet w stylu usługi Wybory z mObywatela. Projekt Koła Naukowego AI Red Team Lab PJATK. Sam frontend, bez backendu.

Stack: React 19, Vite, TypeScript, TanStack Router (hash history), Biome, Vitest, Playwright. Style w `src/styles.css` (tokeny w `:root`).

## Komendy

- `pnpm dev`: podgląd na http://localhost:5173 (`pnpm dev --host` udostępnia w sieci lokalnej)
- `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm e2e`
- `pnpm e2e --update-snapshots`: odświeża wzorcowe zrzuty po zamierzonej zmianie wyglądu

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
