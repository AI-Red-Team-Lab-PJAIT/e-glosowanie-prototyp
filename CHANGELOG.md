# Zmiany

## 2026-10-25

- Pierwsza wersja prototypu: autologowanie, Usługi z wygaszonymi modułami i wyszukiwarką, usługa Wybory (szczegóły z .ics i kopiowaniem adresu, dane w rejestrze, historia), przepływ głosowania z MFA (logowanie, NFC, skan twarzy 3D), cztery rodzaje kart, potwierdzenie i zapis z SHA-256.
- Wygląd odtworzony z oficjalnych grafik usługi Wybory (info.mobywatel.gov.pl) i zrzutu listy usług.
- Na laptopie ramka iPhone'a, na telefonie pełny ekran. Pasek „To nie jest aplikacja rządowa” w środku aplikacji. „O projekcie” jako ekran aplikacji, nie osobna strona.
- Zapasowe SHA-256 w JS, bo w sieci lokalnej po http przeglądarka nie daje `crypto.subtle`.
- Ramka iPhone 14 Pro z devices.css zamiast własnej, skalowana do wysokości okna (max 90%).
- Dziennik debugowania: konsola `[e-gl]` i plik `debug/sesja.jsonl` w dev, `?debug=1` na produkcji.
- Testy: 13 jednostkowych (Vitest), 10 e2e (Playwright, iPhone 15) z axe i zrzutami wzorcowymi.
