# e-głosowanie: prototyp

Klikalny prototyp głosowania przez internet w stylu usługi Wybory z aplikacji mObywatel. Projekt Koła Naukowego AI Red Team Lab PJATK.

> To nie jest aplikacja rządowa. Wszystkie dane są fikcyjne. Projekt nie łączy się z żadnym rejestrem i nie zbiera danych.

**Podgląd:** https://ai-red-team-lab-pjait.github.io/e-glosowanie-prototyp/
**Repo:** https://github.com/AI-Red-Team-Lab-PJAIT/e-glosowanie-prototyp

## Jak to działa

Autologowanie z animacją Face ID, potem zakładka Usługi z jedną aktywną usługą: Wybory. Stamtąd głosowanie przechodzi przez trzy potwierdzenia (logowanie przez Profil zaufany albo bank, odczyt dowodu przez NFC, skan twarzy 3D), wybór wyborów, kartę, potwierdzenie i zapis ze skrótem SHA-256. Historia pokazuje, że głos oddano, ale nie jego treść. Wszystko dzieje się w przeglądarce, bez backendu. Pełny przepływ i otwarte problemy są w `PRODUCT.md`.

## Dokumenty

- `PRODUCT.md`: pomysł, przepływ, otwarte problemy
- `DESIGN.md`: tokeny i pomiary z referencji
- `BACKLOG.md`: co jest otwarte
- `CHANGELOG.md`: co się zmieniło
- `docs/superpowers/specs/` i `docs/superpowers/plans/`: specyfikacja i plan modułu Wybory
- `CLAUDE.md`, `AGENTS.md`: zasady dla modeli AI pracujących w repo

## Uruchomienie

```bash
pnpm install
pnpm dev           # http://localhost:5173
pnpm dev --host    # też w sieci lokalnej, np. na telefonie
```

Na laptopie aplikacja jest w ramce iPhone'a, na telefonie zajmuje cały ekran. `?demo=off` wyłącza autologowanie.

W sieci lokalnej po http przeglądarka nie daje dostępu do kamery, więc skan twarzy działa w trybie pokazowym.

## Debugowanie

W trybie dev każdy klik, zmiana ekranu, akcja stanu i błąd trafia do konsoli (prefiks `[e-gl]`) i do pliku `debug/sesja.jsonl` (poza gitem). Na zbudowanej stronie dziennik włącza `?debug=1`, wtedy tylko w konsoli.

## Testy

```bash
pnpm check && pnpm typecheck && pnpm test && pnpm e2e
```

E2E (Playwright, iPhone 15) przechodzą cały przepływ dla czterech rodzajów wyborów, sprawdzają dostępność (axe) i porównują zrzuty ekranów. Zrzuty wzorcowe są per system w `tests/e2e/__screenshots__/`. CI uruchamia e2e bez porównywania zrzutów.

## Wdrożenie

Push na `main` uruchamia CI (`.github/workflows/ci.yml`: Biome, tsc, Vitest, Playwright bez zrzutów). Po zielonym CI `deploy.yml` buduje stronę i publikuje ją na GitHub Pages. Ręcznie: `gh workflow run deploy.yml`.

## Licencje

Nasz kod: MIT (`LICENSE`). Ramka telefonu: devices.css (MIT). Status bar i animacja Face ID wzorowane na mobywatel.ai (MIT). Szczegóły w `THIRD_PARTY.md`.
