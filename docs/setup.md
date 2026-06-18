# Setting Up Kalabari-AI Locally

This guide walks you through running the full Kalabari-AI stack on your machine.

---

## Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) v9.12.0 — `npm install -g pnpm@9.12.0`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — runs the backend, database, and Redis
- [Git](https://git-scm.com/)

> You do **not** need to install Java, PostgreSQL, or Redis manually. Docker handles all of that.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Tam-BobManuel/Kalabari-AI.git
cd Kalabari-AI
```

## 2. Install Frontend Dependencies

```bash
pnpm install
```

## 3. Set Up Environment Variables

Copy the root example env file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_JWT_ISSUER=https://your-project.supabase.co/auth/v1
```

> Find these in your Supabase project under **Settings → API**. Everything else in the `.env` file can stay as-is for local development.

---

## 4. Start the Full Stack

```bash
docker compose up --build
```

This starts four services:

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (Spring Boot) | http://localhost:8081 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

> The first run will take a few minutes as Docker pulls and builds the images. Subsequent runs will be faster.

---

## 5. Verify Everything is Running

Once the logs settle, open your browser and visit:

- **http://localhost:3000** — you should see the Kalabari-AI frontend
- **http://localhost:8081/swagger-ui.html** — you should see the backend API docs

If both load, you're fully set up.

---

## Frontend-Only Setup (No Docker)

If you're only working on the frontend and don't need the backend running:

```bash
cp frontend/.env.example frontend/.env.local
```

Fill in your Supabase values in `frontend/.env.local`, then:

```bash
pnpm dev:frontend
```

The frontend will run at **http://localhost:3000** and point to the mock backend by default.

---

## Stopping the Stack

```bash
docker compose down
```

To also remove stored data (database, Redis):

```bash
docker compose down -v
```

---

## Need Help?

If you run into issues, check that:

- Docker Desktop is running before you run `docker compose up`
- Your Supabase URL and anon key are correctly copied with no extra spaces
- Port 3000, 5432, or 6379 isn't already in use by another process on your machine

For contribution guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).
