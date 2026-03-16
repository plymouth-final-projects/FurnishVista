# FurnishVista (frontend) + ArchitectLK (backend)

This repository contains a **Next.js furniture layout editor** (2D + 3D) and a **Spring Boot REST API** intended to power it. It was built as coursework for **PUSL3122: HCI, Computer Graphics & Visualisation**.

## Repository Layout

```
frontend/   # Next.js app (UI + editor)
backend/    # Spring Boot REST API + SQL migrations
```

## Frontend (Next.js)

### What’s implemented

- **2D drag & drop editor** (React Konva) with grid + snap-to-grid (0.5m)
- **3D viewport** (React Three Fiber + drei) with orbit controls, environment lighting, and contact shadows
- **Furniture palette** and **properties panel** (position, rotation, scale, shading, color)
- **Undo/redo** history buffer (50 entries)
- **Design management UI**: dashboard, designs list, design detail, duplicate/delete
- **Keyboard shortcuts** (also shown in the “?” dialog):
  - `Ctrl+Z` undo
  - `Ctrl+Shift+Z` redo
  - `Ctrl+S` save
  - `Delete` remove selected
  - `R` rotate 45°
  - `Ctrl+D` duplicate selected
  - `2` / `3` switch 2D / 3D
  - `G` toggle grid
  - `Escape` deselect
  - `?` open shortcuts

### Notes

- The frontend currently uses **mock data + mock services** (no backend integration wired yet).
- The `/` route is still the **default Next.js starter page**; the main experience starts from `/login` → `/dashboard`.

### Tech (from code)

- Next.js **16.1.6** (App Router) + React **19** + TypeScript (strict)
- Tailwind CSS **v4** + shadcn/ui + Radix UI
- Zustand, Framer Motion, Sonner, Lucide
- Fonts: **Geist Sans / Geist Mono** via `next/font`

### Routes

| Route | Description |
|---|---|
| `/login` | Login (mock auth) |
| `/signup` | Signup (mock auth) |
| `/forgot-password` | Password reset request (mock) |
| `/dashboard` | Dashboard overview (stats + quick actions + recent designs) |
| `/designs` | Designs grid (search/sort) |
| `/designs/[id]` | Design detail view |
| `/editor/[id]` | Editor (`new` creates a new design) |

### Run locally

Prerequisites:

- Node.js 18+
- npm

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Backend (Spring Boot)

### Tech (from code)

- Spring Boot **3.5.10** (Gradle)
- Java **17** toolchain
- Spring Web, Validation, Spring Security (session-based setup), Spring Data JPA
- Postgres driver (and H2 dependency present)

### Database

The backend configures a Postgres `DataSource` via environment variables (with defaults):

- `DB_URL` (default `jdbc:postgresql://localhost:5432/architectlk`)
- `DB_USERNAME` (default `postgres`)
- `DB_PASSWORD` (default `nethmal123`)

There is also a Docker Compose file for Postgres:

```bash
cd backend
docker compose up -d
```

SQL migrations are stored in `backend/src/main/resources/db/migration/`. A helper script (`backend/migrate.sh`) runs them against the running Docker container (`architectlk-db`).

> On Windows, run `migrate.sh` via Git Bash or WSL (it uses `docker exec` + `psql`).

### Run locally (Windows)

Prerequisites:

- Java 17
- Docker (optional, for Postgres)

```bash
cd backend
./gradlew.bat bootRun
```

The server defaults to `http://localhost:8080` and allows CORS from `http://localhost:3000`.

Environment variables:

- `SERVER_PORT` (default `8080`)
- `CORS_ALLOWED_ORIGINS` (default `http://localhost:3000`, comma-separated for multiple origins)

### REST API (high level)

- `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/forgot-password`, `GET /api/auth/me`
- `GET /api/dashboard/summary`, `GET /api/dashboard/recent-designs`
- `GET /api/designs`, `GET /api/designs/{id}`, `POST /api/designs`, `PUT /api/designs/{id}`, `DELETE /api/designs/{id}`, `POST /api/designs/{id}/duplicate`
- `GET /api/furniture`, `GET /api/furniture/{id}`, `GET /api/furniture/category/{category}`, `GET /api/furniture/search?q=...`
- `GET /api/rooms`, `POST /api/rooms`, `GET /api/rooms/templates`
- `GET /api/editor/{designId}/state`, `PUT /api/editor/{designId}/layout`, `GET /api/editor/{designId}/history`

## Module Information

- **Module**: PUSL3122 - HCI, Computer Graphics & Visualisation
- **Type**: Coursework project (frontend + backend)
