# Movie-tracker-system

A personal movie watchlist app — discover, search, and manage movies powered by [The Movie Database (TMDB)](https://www.themoviedb.org/).

## Features

- **Auth** — Sign up / sign in (demo mode, no backend; data stored in browser)
- **Search** — Browse popular movies and search by title with infinite scroll
- **Watchlist** — Save movies to your list and manage them in one place
- **Movie details** — View overview, rating, genres, and add/remove from watchlist

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Button, Input, Label, Skeleton, Sonner)
- **TMDB API** for movie data

## Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

## Setup

1. **Clone and install**

   ```bash
   cd Movie-tracker-system
   npm install
   ```

2. **Environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set your TMDB API key. You can use this reference key for quick testing, or get your own free key from TMDB:

   ```env
   NEXT_PUBLIC_TMDB_API_KEY=8265bd1679663a7ea12ac168da84d2e8
   ```

   Get your own free API key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Docker Setup

You can run this application using Docker for both development and production environments.

### Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

### Quick Start with Helper Script

The easiest way to get started:

```bash
# Test your Docker setup
./docker-test.sh

# Use interactive helper (recommended)
./docker-helper.sh
```

The helper script provides an interactive menu for all Docker operations.

### Production (Docker Compose)

1. **Create environment file**

   ```bash
   cp .env.local.example .env
   ```

   Edit `.env` and set your TMDB API key:

   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

2. **Build and run**

   ```bash
   docker-compose up -d
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

3. **Stop the container**

   ```bash
   docker-compose down
   ```

### Development (Docker Compose)

For development with hot reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

This mounts your local code into the container, so changes are reflected immediately.

### Docker Commands

| Command                              | Description                         |
| ------------------------------------ | ----------------------------------- |
| `docker-compose up -d`              | Start production container          |
| `docker-compose down`               | Stop and remove containers          |
| `docker-compose logs -f`            | View container logs                 |
| `docker-compose restart`            | Restart containers                  |
| `docker-compose -f docker-compose.dev.yml up` | Start dev mode with hot reload |
| `docker build -t movie-tracker .`   | Build image manually                |
| `docker run -p 3000:3000 -e NEXT_PUBLIC_TMDB_API_KEY=your_key movie-tracker` | Run manually |

### Docker Image Details

- **Base image**: Node.js 20 Alpine (lightweight)
- **Multi-stage build**: Optimized for production
- **Output size**: ~150MB (compressed)
- **Security**: Runs as non-root user
- **Health check**: Automatic container health monitoring

### Additional Docker Resources

- 📚 [Comprehensive Docker Guide](./DOCKER.md) - Detailed deployment instructions
- 📋 [Docker Quick Reference](./DOCKER-REFERENCE.md) - Command cheatsheet
- 🧪 [Setup Test Script](./docker-test.sh) - Verify Docker installation
- 🛠️ [Helper Script](./docker-helper.sh) - Interactive Docker menu
- 📝 [Makefile](./Makefile) - Command shortcuts

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start development server       |
| `npm run build`    | Build for production           |
| `npm run start`    | Start production server         |
| `npm run lint`     | Run ESLint                     |
| `npm run test`     | Run Jest tests                 |
| `npm run test:watch`   | Run tests in watch mode    |
| `npm run test:coverage` | Run tests with coverage   |

## Project structure

```
├── app/                 # Next.js App Router pages & layout
│   ├── page.tsx        # Auth (login/signup)
│   ├── search/         # Search & popular movies
│   ├── watchlist/      # User watchlist
│   └── movie/[id]/     # Movie detail
├── components/         # React components & shadcn/ui
├── contexts/          # Auth context
├── hooks/             # useRequireAuth, useMovieLoader, useWatchlistActions
├── lib/               # utils, TMDB API, watchlist (localStorage)
├── types/             # TypeScript types
└── __tests__/         # Jest unit tests
```

## Testing

Tests cover TMDB helpers, watchlist utilities, and key UI components (Navigation, movie skeletons).

```bash
npm run test
```

## Notes

- **Demo auth** — No real backend; users and session are stored in `localStorage`. Use any email and password to sign up and sign in.
- **Watchlist** — Stored per user (by email) in `localStorage`.
- **TMDB** — This product uses the TMDB API but is not endorsed or certified by TMDB.
