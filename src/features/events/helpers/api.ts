import { apiClient } from "../../../api/axiosClient";
import type { Contract, Market, MarketEvent } from "../types";

const FEATURED_COMPETITIONS = [
  { id: "25508311", name: "Premier League" }, // England
  { id: "41842975", name: "La Liga" }, // Spain
];
const EVENTS_PER_COMPETITION = 6;
const FEATURED_MARKET_TYPE = "WINNER_3_WAY";


const EVENT_DETAIL_MARKET_TYPES = [
  "WINNER_3_WAY",
  "BTTS",
  "CORRECT_SCORE",
  "WINNER_DNB",
  "DOUBLE_CHANCE",
  "HALF_TIME_WINNER_3_WAY",
  "HALF_FULL",
  "WINNER_AND_BTTS",
  "ODD_EVEN",
  "EXACT_GOALS",
].join(",");

interface RawEvent {
  id: string;
  name: string;
  full_slug: string;
  start_datetime: string | null;
  venue: { country_name: string | null } | null;
}

interface RawMarket {
  id: string;
  event_id: string;
  name: string;
}

interface RawContract {
  id: string;
  market_id: string;
  name: string;
}

interface RawLastExecutedPrice {
  contract_id: string;
  last_executed_price: string;
}

function categoryFromSlug(fullSlug: string): string {
  const segment = fullSlug.split("/")[2];
  if (!segment) {
    return "Sport";
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
}

async function fetchRawEventsForCompetition(competitionId: string): Promise<RawEvent[]> {
  const { data } = await apiClient.get<{ events: RawEvent[] }>("/v3/events/", {
    params: {
      parent_id: competitionId,
      state: "upcoming",
      limit: EVENTS_PER_COMPETITION,
    },
  });
  return data.events;
}

// Fetches each featured competition's events in parallel and keeps track of
// which competition each event came from, since the events endpoint doesn't
// return the parent competition's name.
async function fetchFeaturedRawEventGroups(): Promise<{ competitionName: string; events: RawEvent[] }[]> {
  return Promise.all(
    FEATURED_COMPETITIONS.map(async (competition) => ({
      competitionName: competition.name,
      events: await fetchRawEventsForCompetition(competition.id),
    })),
  );
}

async function fetchRawMarkets(eventIds: string[], params: Record<string, string | boolean>): Promise<RawMarket[]> {
  const { data } = await apiClient.get<{ markets: RawMarket[] }>(`/v3/events/${eventIds.join(",")}/markets/`, {
    params,
  });
  return data.markets;
}

async function fetchRawContracts(marketIds: string[]): Promise<RawContract[]> {
  if (marketIds.length === 0) {
    return [];
  }
  const { data } = await apiClient.get<{ contracts: RawContract[] }>(`/v3/markets/${marketIds.join(",")}/contracts/`);
  return data.contracts;
}

// Public, unauthenticated — no session token needed, unlike the live /quotes/
// endpoint. Returns the price of each contract's most recent real trade.
async function fetchLastExecutedPrices(marketIds: string[]): Promise<Map<string, number>> {
  if (marketIds.length === 0) {
    return new Map();
  }
  const { data } = await apiClient.get<{ last_executed_prices: Record<string, RawLastExecutedPrice[]> }>(
    `/v3/markets/${marketIds.join(",")}/last_executed_prices/`,
  );

  const priceByContractId = new Map<string, number>();
  for (const prices of Object.values(data.last_executed_prices)) {
    for (const price of prices) {
      priceByContractId.set(price.contract_id, Number(price.last_executed_price));
    }
  }
  return priceByContractId;
}

function toMarket(rawMarket: RawMarket, rawContracts: RawContract[], priceByContractId: Map<string, number>): Market {
  const contracts: Contract[] = rawContracts.map((rawContract) => ({
    id: rawContract.id,
    name: rawContract.name,
    price: priceByContractId.get(rawContract.id) ?? 0,
  }));
  return { id: rawMarket.id, name: rawMarket.name, contracts };
}

// Fetches contracts and their last executed prices for all given markets in
// two batched calls, then assembles each raw market into its domain shape.
async function toMarkets(rawMarkets: RawMarket[]): Promise<Market[]> {
  const marketIds = rawMarkets.map((market) => market.id);
  const [rawContracts, priceByContractId] = await Promise.all([
    fetchRawContracts(marketIds),
    fetchLastExecutedPrices(marketIds),
  ]);
  const rawContractsByMarketId = groupBy(rawContracts, (contract) => contract.market_id);
  return rawMarkets.map((rawMarket) =>
    toMarket(rawMarket, rawContractsByMarketId.get(rawMarket.id) ?? [], priceByContractId),
  );
}

function toMarketEvent(rawEvent: RawEvent, markets: Market[], competitionName: string): MarketEvent {
  const category = categoryFromSlug(rawEvent.full_slug);
  return {
    id: rawEvent.id,
    title: rawEvent.name,
    category,
    competition: competitionName,
    country: rawEvent.venue?.country_name ?? category,
    startTime: rawEvent.start_datetime ?? new Date().toISOString(),
    markets,
  };
}

export const eventsApi = {
  getEvents: async (): Promise<MarketEvent[]> => {
    const competitionGroups = await fetchFeaturedRawEventGroups();
    const rawEvents = competitionGroups.flatMap((group) => group.events);
    if (rawEvents.length === 0) {
      return [];
    }

    const competitionNameByEventId = new Map<string, string>();
    for (const group of competitionGroups) {
      for (const rawEvent of group.events) {
        competitionNameByEventId.set(rawEvent.id, group.competitionName);
      }
    }

    const rawMarkets = await fetchRawMarkets(
      rawEvents.map((event) => event.id),
      { market_types: FEATURED_MARKET_TYPE },
    );
    const markets = await toMarkets(rawMarkets);
    const marketsById = new Map(markets.map((market) => [market.id, market]));
    const rawMarketsByEventId = groupBy(rawMarkets, (market) => market.event_id);

    return rawEvents.map((rawEvent) => {
      const eventMarkets = (rawMarketsByEventId.get(rawEvent.id) ?? [])
        .map((rawMarket) => marketsById.get(rawMarket.id))
        .filter((market): market is Market => market !== undefined);
      return toMarketEvent(rawEvent, eventMarkets, competitionNameByEventId.get(rawEvent.id) ?? "Other");
    });
  },

  // The homepage feed only carries one market (Full-time result) per event.
  // This fetches a broader curated set for a single event, to enrich the
  // event page once the user drills in.
  getEventMarkets: async (eventId: string): Promise<Market[]> => {
    const rawMarkets = await fetchRawMarkets([eventId], { market_types: EVENT_DETAIL_MARKET_TYPES });
    return toMarkets(rawMarkets);
  },

  getLatestPrices: async (marketIds: string[]): Promise<{ contractId: string; price: number }[]> => {
    const priceByContractId = await fetchLastExecutedPrices(marketIds);
    return Array.from(priceByContractId, ([contractId, price]) => ({ contractId, price }));
  },
};
