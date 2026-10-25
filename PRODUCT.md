# Produkt

## Po co

Koło AI Red Team Lab chce pokazać i przetestować koncepcję głosowania przez internet w mObywatelu: wieloskładnikowe potwierdzenie tożsamości, karta do głosowania, zapis głosu w rejestrze opartym na blockchainie i historia. Prototyp służy do dyskusji i ćwiczeń red teamu, nie do wdrożenia.

## Dla kogo

Członkowie Koła, prowadzący i osoby na pokazach. Oglądają na laptopie (telefon w ramce iPhone'a) albo na własnym telefonie (pełny ekran).

## Przepływ

1. Autologowanie z animacją Face ID, od razu zakładka Usługi (`?demo=off` pokazuje ekran logowania).
2. Usługi: aktywna tylko usługa Wybory, reszta wygaszona.
3. Wybory: „Masz czynne prawo wyborcze”, zaplanowane wybory, szczegóły z kalendarzem (.ics), dane w rejestrze, historia.
4. Logowanie: Profil zaufany albo bank (atrapy).
5. Skan dowodu przez NFC (1 z 4).
6. Skan twarzy 3D (2 z 4), kamera opcjonalna.
7. Tożsamość potwierdzona.
8. Wybór wyborów (3 z 4).
9. Karta: jeden kandydat, listy komitetów albo referendum TAK/NIE.
10. Potwierdzenie (4 z 4).
11. Głos oddany: skrót SHA-256 z solą i identyfikator zapisu.
12. Historia głosowań (localStorage), bez treści głosu.

## Otwarte problemy (celowo nierozwiązane)

- Złośliwe oprogramowanie na telefonie może podmienić głos.
- Tajność: kto sprawdza tożsamość, nie może widzieć treści głosu.
- Przymus i kupowanie głosów w domu.
- Blockchain dowodzi niezmienności zapisu, nie zgodności z intencją wyborcy.
