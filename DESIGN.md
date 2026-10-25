# Design

Odtwarzamy wygląd usługi Wybory z aplikacji mObywatel (iOS) na podstawie oficjalnych grafik z info.mobywatel.gov.pl i zrzutów z artykułów (pliki lokalnie w `docs/referencje/`, poza gitem). Celem jest wierność wzorowi, nie własna marka.

Dial: ENERGY 1 / RHYTHM 1 / MOTION 1. To aplikacja usług publicznych: spokojna, przewidywalna, ruch tylko tam, gdzie pokazuje postęp skanu.

## Tokeny

| Token | Wartość | Skąd / po co |
|---|---|---|
| `--bg` | `#f2f4f8` | tło ekranów z referencji |
| `--surface` | `#ffffff` | karty |
| `--ink` | `#111216` | tekst główny |
| `--ink2` | `#5f6270` | podpisy, 5,5:1 na tle |
| `--accent` | `#1f5fdc` | „Wróć”, aktywna zakładka, przyciski; 5,1:1 na tle, 5,6:1 biały na nim |
| `--accent-wash` | `#e6edfb` | przyciski-pigułki „Do kalendarza”, „Kopiuj” |
| `--info-wash` / `--info-ink` | `#dce7fb` / `#1d4ea8` | ramka informacyjna |
| `--ok` | `#2e7d32` | potwierdzenia |

Kontrasty sprawdzone skryptem `contrast-check.py` (WCAG AA).

## Pomiary (punkty iOS, ekran 393 pt)

- Pasek nawigacji 44 pt: „‹ Wróć” 17 pt w kolorze akcentu, tytuł 17 pt semibold na środku.
- Ikona usługi w kółku 72 pt, tło `#dde3ec`.
- Duży tytuł 34/41 pt bold, odstęp do sekcji ok. 28 pt.
- Nagłówek sekcji 17 pt semibold, 12 pt nad kartą.
- Karta: margines 16 pt, promień 16 pt, bardzo lekki cień, wiersz min. 56 pt, tytuł 17 pt semibold, podpis 13 pt, chevron po prawej.
- Lista usług: ikona kolorowa 26 pt, separator od tekstu (wcięcie 56 pt).
- Pole danych: etykieta 14 pt szara, wartość 19 pt semibold.
- Tab bar: 4 pozycje (Dokumenty, Usługi, Kod QR, Więcej), ikona 26 pt, etykieta 11 pt, aktywna w kolorze akcentu.
- Przycisk główny: wysokość 52 pt, promień 14 pt.

## Decyzje

- Font systemowy (SF Pro na iOS), bo tak wygląda prawdziwa aplikacja; nie ładujemy fontów z sieci.
- Tylko jasny motyw: odtwarzamy jasne zrzuty referencyjne. Ciemny motyw jest w backlogu.
- Wygaszone usługi mają przezroczystość 0,4 i `aria-disabled`, po kliknięciu pokazują komunikat.
- Na laptopie ramka iPhone'a (393 × 852), na telefonie (do 520 px) pełny ekran bez ramki i bez sztucznego status baru.
