# e-głosowanie: prototyp

Klikalny prototyp głosowania przez internet w stylu usługi Wybory z aplikacji mObywatel. Projekt Koła Naukowego AI Red Team Lab PJATK.

> To nie jest aplikacja rządowa. Wszystkie dane są fikcyjne. Projekt nie łączy się z żadnym rejestrem i nie zbiera danych.

Podgląd: https://ai-red-team-lab-pjait.github.io/e-glosowanie-prototyp/ (po włączeniu GitHub Pages)

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

## Licencje

Nasz kod: MIT (`LICENSE`). Ramka telefonu: devices.css (MIT). Status bar i animacja Face ID wzorowane na mobywatel.ai (MIT). Szczegóły w `THIRD_PARTY.md`.
