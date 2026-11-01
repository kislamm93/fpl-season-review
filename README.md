# FPL Season Review

Fantasy Premier League analytics in the browser: fixture difficulty, betting
markets, mini-league standings, and a chat analyst that answers from live data
rather than from memory.

Part of a three-service stack:

| Service | Repo | Runs on |
| --- | --- | --- |
| This UI | `fpl-season-review` | GitHub Pages |
| API | `fpl-backend` | Render |
| Agent | `fpl-agent-gcp` | Cloud Run (Gemini via Vertex AI) |

The browser only ever talks to the backend. The agent is reached through it, so
no keys or agent URLs are in this bundle.

## Pages

- **Fixture Ticker** — official FDR over a gameweek range, sortable easy to hard
- **Market Odds** — win probability, anytime goalscorer odds, clean sheets, and
  goals markets, with an on-demand refresh that spends betting-API credits
- **My Team Stats / Compare Teams** — your squad against a rival's
- **Mini-League Preview / League Details / Manager History** — standings and form
- **Chat analyst** — sits beside Market Odds and knows which tab you are on, so
  "who's the best differential here?" resolves without spelling it out

## Running it locally

Requires Node 20.

```sh
npm ci
npm run dev
```

That serves on `:8080` and expects the backend on `http://localhost:8000`. To
point at the deployed backend instead, set `VITE_API_BASE`:

```sh
VITE_API_BASE=https://fpl-backend-xio6.onrender.com npm run dev
```

Other scripts:

```sh
npm run typecheck   # tsc --noEmit — `vite build` does NOT typecheck
npm run lint        # eslint
npm run build       # production bundle into dist/
npm run preview     # serve the built bundle
```

`npm run typecheck` is worth knowing about: Vite strips types with esbuild
without reading them, so a type error builds cleanly and ships. CI runs it as a
blocking gate for that reason.

## Deploying

Push to `main`. `.github/workflows/deploy-ui.yml` typechecks, builds, and
publishes to GitHub Pages.

Two repo settings it depends on, under **Settings → Secrets and variables →
Actions → Variables**:

- `VITE_API_BASE` — the backend origin, no trailing slash. The build fails
  loudly if it is unset rather than shipping a site that calls the wrong host.

`VITE_BASE` is set by the workflow itself to `/<repo>/`, because a GitHub Pages
project site is served from a subpath.

## Stack

Vite · React 18 · TypeScript · Tailwind · shadcn/ui · TanStack Query · React Router
