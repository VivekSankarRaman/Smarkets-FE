import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventsApi } from "../helpers/api";
import type { EventsState } from "../types";

interface EventsRootState {
  events: EventsState;
}

export const fetchEvents = createAsyncThunk("events/fetchEvents", () => eventsApi.getEvents());

export const fetchEventMarkets = createAsyncThunk("events/fetchEventMarkets", async (eventId: string) => {
  const markets = await eventsApi.getEventMarkets(eventId);
  return { eventId, markets };
});

export const fetchLatestPrices = createAsyncThunk<
  { contractId: string; price: number }[],
  void,
  { state: EventsRootState }
>("events/fetchLatestPrices", (_, { getState }) => {
  const marketIds = getState().events.items.flatMap((event) => event.markets).map((market) => market.id);
  return eventsApi.getLatestPrices(marketIds);
});
