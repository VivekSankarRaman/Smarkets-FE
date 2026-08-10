# Betting Exchange

A Smarkets-inspired betting exchange frontend, showing live sports betting data from Smarkets' public API.

## Tech stack

React 19 · TypeScript · Redux Toolkit + react-redux · React Router 8 · MUI + Emotion · Axios · Rspack · Yarn

## Getting started

Node must be **20.19+ or 22.12+** — pinned to `24.13.1` via `.nvmrc`.

```bash
nvm use
yarn install
```

```bash
yarn dev       # dev server at http://localhost:8080, with HMR
yarn build     # production build to dist/
yarn preview   # serves the dist/ build — run `yarn build` first, preview does not rebuild
```

For architecture, features, data sources, and known limitations, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
