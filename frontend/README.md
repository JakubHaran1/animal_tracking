# Frontend — Animal Tracking

Frontend aplikacji został przygotowany w React + TypeScript i obecnie działa jako interaktywny prototyp UI z logiką opartą o mocki danych.

## Stack

- React 19 + TypeScript
- Vite 7
- React Router 7
- Tailwind CSS 4
- Axios (gotowy klient HTTP)
- Vitest + Testing Library (testy jednostkowe komponentów/usług)

## Co jest zaimplementowane

### Nawigacja i layout

- Globalny layout z navbar-em i modalem logowania/rejestracji.
- Routing:
	- `/` — ekran główny (mapa placeholder)
	- `/friends` — lista znajomych (chroniona)
	- `/profile` — mój profil (chroniona)
	- `/friends/:friendId/profile` — profil znajomego (chroniona)

### Autoryzacja (MVP)

- `AuthContext` zarządza stanem zalogowania wyłącznie po stronie klienta.
- `ProtectedRoute` przekierowuje niezalogowanego użytkownika na `/`.
- Modal logowania działa w trybie placeholder (logowanie lokalne, bez backendu auth).

### Widoki i funkcje

- Ekran główny:
	- placeholder mapy z licznikiem obserwacji,
	- możliwość dodania obserwacji po zalogowaniu,
	- modal dodawania obserwacji (`title`, `description`, `location`, `image`).
- Znajomi:
	- pobieranie listy,
	- usuwanie znajomego,
	- przejście do profilu znajomego.
- Profile:
	- widok własnego profilu,
	- widok profilu znajomego po `friendId`.

## Dane i serwisy

Aktualnie warstwa danych opiera się o mocki (`src/mocks/*`) i lokalny stan w serwisach (`src/services/*`):

- `observationsService` — pobieranie i tworzenie obserwacji,
- `friendsService` — lista znajomych, ID znajomych, usuwanie,
- `profileService` — profil użytkownika i profile znajomych.

Jest też przygotowany klient API:

- `apiClient` (Axios) z `baseURL` z `VITE_API_BASE_URL` (domyślnie `/api`).

To ułatwia późniejsze przejście z mocków na realne endpointy backendu.

## Uruchomienie

W katalogu `frontend`:

```bash
npm install
npm run dev
```

Domyślnie aplikacja startuje pod adresem podanym przez Vite (najczęściej `http://localhost:5173`).

## Dostępne skrypty

- `npm run dev` — uruchomienie trybu developerskiego,
- `npm run build` — build produkcyjny,
- `npm run preview` — podgląd buildu,
- `npm run lint` — lint projektu,
- `npm run test` — uruchomienie testów w trybie interaktywnym,
- `npm run test:run` — jednorazowe uruchomienie testów,
- `npm run test:watch` — testy w watch mode.

## Testy

W projekcie są testy dla kluczowych elementów:

- komponentów (m.in. modal autoryzacji, modal dodawania obserwacji),
- kontekstu auth,
- routingu chronionego,
- serwisów (API/friends/observations).

Uruchomienie:

```bash
npm run test:run
```

## Następny krok (integracja)

Naturalnym kolejnym etapem jest podmiana serwisów opartych o mocki na wywołania backendu Django REST i spięcie prawdziwego logowania/rejestracji.
