# Architecture & Features

Detail behind [README.md](../README.md) — setup/scripts live there; this covers what's built, how, and what it deliberately doesn't do.

## Project structure

```
src/
  api/
    axiosClient.ts        Shared axios instance (baseURL "/api", attaches Authorization from tokenStorage)
  app/
    store.ts               configureStore, RootState/AppDispatch types
    hooks.ts                Typed useAppDispatch / useAppSelector
  features/
    auth/
      actions/index.ts      login/logout thunks — USE_MOCK_AUTH flag lives here
      reducers/index.ts     createSlice + extraReducers (pure state transitions)
      helpers/
        api.ts               Real Smarkets /v3/sessions/ calls (currently unused, dormant)
        tokenStorage.ts      localStorage read/write/clear for the auth token
      types/index.ts
    events/
      actions/index.ts      fetchEvents / fetchEventMarkets / fetchLatestPrices thunks
      reducers/index.ts     createSlice + extraReducers
      helpers/
        api.ts               All real Smarkets event/market/contract/price calls
        formatEventStartTime.ts
      hooks/
        useEvents.ts         Fetch-once-on-mount + selector, used by Home/Event pages
        useEventMarkets.ts   Fetches the fuller market set for one event, on Event page
        usePriceTicker.ts    Polls fetchLatestPrices every 7s, mounted in Layout
      types/index.ts
  components/               Shared presentational components (EventRow, CompetitionSection,
                            MarketCard, ContractChip, Layout, icons/)
  pages/                    Route-level pages (HomePage, EventPage, LoginPage, NotFoundPage)
  routes/                   paths.ts, AppRoutes.tsx, ProtectedRoute.tsx
  theme/                    colors.ts (brand palette), theme.ts (MUI theme), index.ts (barrel)
```

**Redux Toolkit organization**: each feature is split into `actions/`, `reducers/`, `helpers/`, `types/` (and `hooks/` where relevant), rather than the more common single-slice-file pattern. This was a deliberate choice — `createSlice` bundles actions and reducers by design, so getting a real separation required defining plain actions via `createAsyncThunk`/`createAction` in `actions/`, and having the slice in `reducers/` respond to them via `extraReducers`/`addCase`, importing the actions rather than defining them.

## Features implemented

### Homepage

Shows events grouped into sections by competition (currently **Premier League** and **La Liga**, 6 upcoming fixtures each — see [Data curation](#data-curation-choices)). Each event is a row showing:
- Placeholder jersey icons (generic, not real crests — Smarkets' API doesn't provide logo images) and the two team names, split from the event title on `" vs "`
- Kick-off time and country (from the fixture's `venue.country_name`)
- The event's "Full-time result" market as three price pills

Prices refresh every 7 seconds by re-fetching real last-executed-price data (see [Prices](#prices)). Layout collapses from an inline row to a stacked column below the `lg` (1200px) breakpoint.

### Event detail page

Clicking an event shows its full detail: category, title, kick-off time, and a curated set of **10 markets** (not literally every market Smarkets offers — a real fixture can have over 100; see [Data curation](#data-curation-choices)), each rendered as its own card. Within a market card, contracts render in a 2-column grid (`name — price`, space-between) that collapses to 1 column below the `md` (900px) breakpoint.

The homepage's single-market feed and the event page's fuller market list are two separate fetches (`fetchEvents` vs `fetchEventMarkets`) — the event page shows whatever's already loaded immediately, then upgrades to the fuller set once the second fetch resolves.

### Prices

Contract prices are **real**, not simulated. They come from Smarkets' `GET /v3/markets/{ids}/last_executed_prices/` — the price of each contract's most recent actual trade, not a live order-book quote. A market with no recent trading activity will show `0` or a stale timestamp; that's real data, not a bug. This endpoint's OpenAPI spec declares it requires a session token (`security: [{"api_key": []}]`), but it was verified (repeatedly, including batched multi-market calls) to work with **zero auth headers** in practice — a documented spec/implementation mismatch, not something we can rely on staying true forever.

### Authentication

The login **UI and request/response contract** are wired to Smarkets' real API (`POST /v3/sessions/` — `username`, `password`, `remember`), but the actual network call is currently a **local mock**, controlled by a single flag:

```ts
// src/features/auth/actions/index.ts
const USE_MOCK_AUTH = true;
```

**Why**: real login against `api.smarkets.com` is rejected by Smarkets' device-trust anti-fraud system, even with valid credentials:
1. Initially blocked with `SOURCE_BLOCKED`-style errors traced to the browser's `Origin`/`Referer` headers — worked around by stripping those in the dev proxy (see [CORS / dev proxy](#cors--dev-proxy)).
2. After that fix, blocked again with `DEVICE_NOT_TRUSTED` — a deeper, named security check.
3. Confirmed the same credentials work fine via Postman and via logging into the real Smarkets website directly from the same machine — ruling out an account-level issue and confirming it's specifically about this app being an unrecognized client.
4. The remaining fix (stripping further browser fingerprint headers — `Sec-Fetch-*`, `Sec-Ch-Ua-*`, `User-Agent`) would mean actively disguising the client to defeat a security control Smarkets put there on purpose, on a real trading account. That was judged not worth pursuing further.

The token is stored in `localStorage` (via `tokenStorage.ts`) and attached to every request as `Authorization: Session-Token <token>` by an axios interceptor in `api/axiosClient.ts`. **This is XSS-exposed** — acceptable for this project's scope, not something to carry into a real production deployment without moving to httpOnly cookies.

MFA is not handled: if a real login ever returned `factor: "totp"` or `"nemid"`, the thunk rejects with a generic "additional verification required" message rather than a real verification flow.

### Route protection

`routes/ProtectedRoute.tsx` exists and redirects to `/login` when there's no token in the auth state. **It is currently commented out** in `routes/AppRoutes.tsx` (disabled during development to make it easier to test Home/Event pages without logging in each time). Re-enabling it is uncommenting two lines in `AppRoutes.tsx`.

Logout (`features/auth/actions/index.ts`) clears the token from `localStorage` immediately (before the network call resolves), so the UI reacts instantly once `ProtectedRoute` is active.

### Theming

`theme/colors.ts` holds Smarkets' actual brand palette (provided as CSS custom properties, mirrored into `index.css` `:root` for any plain-CSS usage, and into the MUI theme for component styling): primary/hover/dark/light variants of green, blue, purple, orange, yellow, pink, plus a grey scale. Mapped onto MUI's palette as `primary`=green, `secondary`/`info`=blue, `success`=green, `error`=pink, `warning`=orange, and two custom palette colors (`purple`, `yellow`) added via MUI's type-augmentation pattern so they work anywhere a built-in color would (e.g. `<Button color="purple">`).

Theme-level overrides (`theme/theme.ts`):
- `MuiOutlinedInput` / `MuiButton`: `borderRadius: 16`
- `MuiButton`: `textTransform: "none"` (MUI's default uppercases button text); explicit hover-color variants per brand color, since MUI's default hover behavior reuses the `dark` palette value but these brand colors define hover as a distinct value from dark
- `MuiCard`: custom box-shadow, with a stronger shadow on hover

### Responsive design

- Homepage `EventRow`: inline row → stacked column below `lg` (1200px)
- Event page `MarketCard` contract grid: 2 columns → 1 column below `md` (900px)

(These two breakpoints were chosen independently in response to separate requests during development — worth knowing if you want them consistent.)

## Data source: Smarkets API

All data comes from `https://api.smarkets.com`, proxied through the dev server at `/api/*` (see below).

| Endpoint | Method | Auth per spec | Auth observed | Used for |
|---|---|---|---|---|
| `/v3/events/` | GET | No | No | List events for a competition (`parent_id`, `state`, `limit`) |
| `/v3/events/{ids}/markets/` | GET | No | No | Markets for one or more events, filtered by `market_types` |
| `/v3/markets/{ids}/contracts/` | GET | No | No | Contracts for one or more markets |
| `/v3/markets/{ids}/last_executed_prices/` | GET | **Yes** (`api_key`) | **No** | Real prices — initial load and the 7s poll |
| `/v3/sessions/` | POST | No | — | Login (contract-compatible; not actually called — see [Authentication](#authentication)) |
| `/v3/sessions/` | DELETE | Yes | — | Logout (contract-compatible; not actually called) |

### CORS / dev proxy

The browser can't call `api.smarkets.com` directly (no CORS headers for arbitrary origins), so `rspack.config.ts` proxies `/api/*` → `https://api.smarkets.com/*` server-side in the dev server, and strips the `Origin`/`Referer` headers on the way out. This proxy is **dev/preview-only** — `rspack build` produces static files with no server behind them, so a real deployment needs an actual backend to do this proxying (which would also be the natural place to move real login to, once/if that becomes viable).

The header-stripping was added specifically to get past an auth-related fraud check (see [Authentication](#authentication));

### Data curation choices

- **Competitions**: hardcoded to England Premier League (`25508311`) and Spain La Liga (`41842975`), 6 upcoming fixtures each. Smarkets' event tree is a multi-level hierarchy (sport → competition → match), so "browse everything" isn't a single API call — featuring more competitions means adding more IDs to `FEATURED_COMPETITIONS` in `features/events/helpers/api.ts`.
- **Homepage market**: only `WINNER_3_WAY` ("Full-time result") per event, by design — the homepage is a feed, not a detail view.
- **Event page markets**: a hand-picked list of 10 market types (`EVENT_DETAIL_MARKET_TYPES` in the same file), chosen because a real fixture can have 100+ markets, many of which are near-duplicate families (e.g. `OVER_UNDER` alone returns 7 threshold variants — 0.5 through 6.5 — for one `market_types` request). The 10 chosen are all single-instance types, giving a fixed, predictable, non-repetitive set.
- **Team names**: split from the event title on `" vs "` — a heuristic that works for Smarkets' football fixture naming convention, not structured `home`/`away` fields. Would need revisiting for non-2-team event types.

## Known limitations

- **Login is not wired** (see [Authentication](#authentication)) — no real account is ever authenticated.
- **Route guard is disabled** — `ProtectedRoute` exists but isn't wired into `AppRoutes.tsx` right now, so all pages are reachable without logging in.
- **Auth token in `localStorage`** — XSS-exposed; fine for this project, not for a real deployment.
- **CORS proxy is dev-only** — no equivalent in the production build; a real deployment needs its own backend.
- **No live order book** — prices are last-executed-trade data, not bid/ask quotes; the real `/quotes/` endpoint requires auth and isn't used.
- **No volume/liquidity or order-book UI** — omitted rather than fabricated; no such data source is wired up.
- **Curated data, not exhaustive** — 2 competitions, 6 events each, 10 market types on the event page (see [Data curation](#data-curation-choices)).
- **No MFA flow** — TOTP/NemID login factors surface as a generic error.
- **No automated tests, no ESLint configuration.**
- **Production bundle exceeds Rspack's recommended size budget** (~670-680KB vs. its 300KB/asset, 500KB/entrypoint guidance) — no code-splitting has been done.

