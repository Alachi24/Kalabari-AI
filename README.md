# Kalabari AI

AI-powered translation and language detection for Nigerian languages.

This is a **pnpm monorepo** with two apps that run as one system:

```
┌────────────┐     same-origin      ┌──────────────────┐   server→server   ┌────────────────────┐
│  Browser   │ ───────────────────▶ │  Next.js (BFF)   │ ────────────────▶ │  Spring backend     │
│  (React)   │   /api/translate…    │  route handlers  │   /api/v1/…       │  AI gateway         │
└────────────┘                      └──────────────────┘                   └─────────┬──────────┘
                                              │                                       │
                                              │ auth + history                        │ chat/completions
                                              ▼                                       ▼
                                       ┌────────────┐                          ┌──────────────┐
                                       │  Supabase  │                          │ Model server │
                                       │ (auth, DB) │                          │ (Gemma, TBD) │
                                       └────────────┘                          └──────────────┘
```

## Responsibilities

- **`frontend/` — Next.js 16 / React 19.** The UI plus a thin **BFF (backend-for-frontend)** layer.
  Route handlers under `app/api/*` call the backend **server-to-server** (the backend URL stays
  server-only). Supabase is the single owner of **auth** and **translation history**.
- **`backend/` — Spring Boot.** A **stateless AI inference gateway** exposing `POST /api/v1/translate`,
  `/detect`, and `/generate`. It forwards to an OpenAI-compatible model server and caches translations
  in Redis. Until the fine-tuned model is deployed it runs an in-memory **mock client** (`MODEL_SERVER_MOCK=true`).

The frontend's old in-browser Transformers.js inference was removed — translation/detection now have a
single implementation, in the backend.

## Prerequisites

- Node.js 18+ and **pnpm 9+** (`corepack enable` then `corepack prepare pnpm@9 --activate`)
- Java 21 + Maven (for the backend)
- A Supabase project (auth + history)
- Optional: Docker (for backend + Redis via `docker-compose.yml`)

## Setup

```bash
# 1. Install JS dependencies (workspace root)
pnpm install

# 2. Configure the frontend
cp frontend/.env.example frontend/.env.local   # then fill in Supabase + BACKEND_URL
```

## Run — local dev (hot reload)

```bash
pnpm dev
```

Starts the Spring backend (dev profile → mock model) and the Next.js dev server concurrently.
Run them individually with `pnpm dev:backend` / `pnpm dev:frontend`.

- Frontend: http://localhost:3000
- Backend Swagger UI: http://localhost:8080/swagger-ui.html

## Run — Docker (whole stack)

The repo is fully containerized: `frontend`, `backend`, and `redis`.

```bash
cp .env.example .env        # fill in NEXT_PUBLIC_SUPABASE_* at minimum
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

Notes:
- Compose auto-reads the root `.env`. The `NEXT_PUBLIC_SUPABASE_*` values are **build args** (inlined
  into the client bundle), so changing them requires a rebuild (`docker compose up --build`).
- Inside the network the frontend reaches the backend at `http://backend:8080` (set via `BACKEND_URL`);
  you don't set that yourself.
- The backend runs with the mock model (`MODEL_SERVER_MOCK=true`) until your fine-tuned model server is up.

## Configuration

| Where | Variable | Purpose |
|-------|----------|---------|
| `frontend/.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase auth + history |
| `frontend/.env.local` | `BACKEND_URL` | Backend base URL used by the BFF (default `http://localhost:8080`) |
| backend env | `MODEL_SERVER_URL`, `MODEL_API_KEY` | OpenAI-compatible model server |
| backend env | `MODEL_SERVER_MOCK` | `true` to use the mock client (default in the `dev` profile) |
| backend env | `APP_CORS_ALLOWED_ORIGINS` | Comma-separated CORS allowlist (default `http://localhost:3000`) |

## Notes / follow-ups

- **Auth on the backend.** Inference endpoints are public; history/dataset endpoints require a JWT.
  This Supabase project uses **legacy HS256** tokens, which the current JWKS-based decoder can't validate —
  so user history is served by the frontend via Supabase (RLS-protected), not the backend's JPA history layer.
  That JPA history/dataset code in the backend is currently dormant; wire it up (and switch the decoder to the
  HS256 shared secret) only once you decide the backend should own user data.
