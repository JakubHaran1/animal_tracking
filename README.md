# Animal Tracking

Animal Tracking to aplikacja webowa do zarzadzania i przegladania obserwacji zwierzat. Projekt jest podzielony na backend API (Django REST Framework) oraz frontend SPA (React + TypeScript).

## Spis tresci

1. Opis projektu
2. Najwazniejsze funkcjonalnosci
3. Stack technologiczny
4. Architektura
5. Szybki start (Docker)
6. Uruchomienie lokalne
7. Konfiguracja srodowiska
8. API overview
9. Struktura repozytorium
10. Diagramy
11. Skrypty developerskie
12. Plan rozwoju

## 1. Opis projektu

Celem projektu jest dostarczenie lekkiej platformy do:
- logowania uzytkownikow i autoryzacji opartej o JWT,
- przegladania danych zwiazanych z obserwacjami,
- rozwijania funkcji mapowych i spolecznosciowych w warstwie frontendowej,
- wygodnego uruchamiania calosci przez Docker Compose.

## 2. Najwazniejsze funkcjonalnosci

- Backend API z endpointami dla uzytkownikow, gatunkow i obserwacji.
- Logowanie JWT (access/refresh) oraz endpoint aktualnego uzytkownika.
- Frontend z routingiem i widokami: mapa, znajomi, profil, profil znajomego.
- Warstwa serwisow frontendowych gotowa do pracy z API.
- Obsluga uploadu obrazu obserwacji po stronie backendu.

## 3. Stack technologiczny

Backend:
- Python
- Django 6
- Django REST Framework
- djangorestframework-simplejwt
- Pillow
- SQLite / PostgreSQL

Frontend:
- React 19
- TypeScript
- Vite 7
- React Router 7
- Tailwind CSS 4
- Axios
- Leaflet + React-Leaflet
- Vitest + Testing Library

## 4. Architektura

### Backend (Django)

- Konfiguracja projektu: `backend/config`
- Aplikacja domenowa: `backend/api`
- Modele: uzytkownik, gatunek, obserwacja
- Serializery i viewsety DRF
- Autoryzacja JWT + endpointy auth

### Frontend (React)

- Routing aplikacji: `frontend/src/router`
- Komponenty UI: `frontend/src/components`
- Strony: `frontend/src/pages`
- Warstwa API i serwisow: `frontend/src/api`, `frontend/src/services`
- Kontekst autoryzacji: `frontend/src/context/AuthContext.tsx`

## 5. Szybki start (Docker)

Wymagania:
- Docker
- Docker Compose

Uruchomienie:

```bash
docker compose up --build
```

Domyslne adresy:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django admin: http://localhost:8000/admin/

Aktywne uslugi:
- backend
- frontend

Domyslna baza danych:
- SQLite (plik `backend/db.sqlite3`, podmontowany jako volume)

## 6. Uruchomienie lokalne

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## 7. Konfiguracja srodowiska

### Backend (`backend/.env`)

Podstawowe zmienne:
- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOW_ALL_ORIGINS`
- `DB_ENGINE` (`sqlite` lub `postgres`)

Zmienne PostgreSQL:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` (np. `http://localhost:8000/api/`)

### PostgreSQL w Docker (profil opcjonalny)

```bash
docker compose --profile postgres up --build
```

Przy tym profilu ustaw:

```env
DB_ENGINE=postgres
POSTGRES_HOST=postgres
```

## 8. API overview

Auth:
- `POST /api/token/`
- `POST /api/token/refresh/`
- `POST /api/users/login/`
- `GET /api/users/me/`

Zasoby (DRF Router):
- `/api/users/`
- `/api/species/`
- `/api/observations/`

Przykladowe requesty: `backend/api.http`



## 9. Skrypty developerskie

Frontend (`frontend/package.json`):
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run test`
- `npm run test:run`
- `npm run test:watch`

Backend (manage.py):
- `python manage.py runserver`
- `python manage.py migrate`
- `python manage.py createsuperuser`
- `python manage.py test`

