# Moduł Wybory: projekt

Szczegóły produktu są w `PRODUCT.md`, wygląd w `DESIGN.md`. Tu zapisujemy decyzje techniczne.

- Routing: TanStack Router z hash history, trasy w `src/router.tsx`. Hash, bo GitHub Pages nie przepisuje adresów.
- Stan: `useReducer` w `src/state/stan.ts`. Reducer pilnuje kolejności kroków MFA, nie przyjmuje głosu bez MFA i przyjmuje tylko jeden głos na wybory.
- Strażnicy ekranów: komponent `Wymaga` w `src/wybory/Glosowanie.tsx` przekierowuje do pierwszego niezaliczonego kroku.
- Zapis głosu: `src/ledger/ledger.ts`, SHA-256 z losową solą i identyfikator `0x` + 40 hex. Zapasowa implementacja w JS dla stron po http.
- Historia: `localStorage` pod kluczem `e-glosowanie:historia`, bez treści głosu. Błąd odczytu pokazuje komunikat.
- Dziennik: `src/debug/dziennik.ts` i wtyczka Vite w `vite.config.ts` (tylko dev).
- Jakość: Vitest dla logiki, Playwright + axe + zrzuty dla ekranów.
