import { createSlice } from "@reduxjs/toolkit";
import { fetchEventMarkets, fetchEvents, fetchLatestPrices } from "../actions";
import type { EventsState } from "../types";

const initialState: EventsState = {
  items: [],
  status: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load events";
      })
      .addCase(fetchEventMarkets.fulfilled, (state, action) => {
        const event = state.items.find((item) => item.id === action.payload.eventId);
        if (event) {
          event.markets = action.payload.markets;
        }
      })
      .addCase(fetchLatestPrices.fulfilled, (state, action) => {
        const priceByContractId = new Map(action.payload.map((price) => [price.contractId, price.price]));
        const contracts = state.items.flatMap((event) => event.markets).flatMap((market) => market.contracts);
        for (const contract of contracts) {
          const price = priceByContractId.get(contract.id);
          if (price !== undefined) {
            contract.price = price;
          }
        }
      });
  },
});

export default eventsSlice.reducer;
