export interface Contract {
  id: string;
  name: string;
  price: number;
}

export interface Market {
  id: string;
  name: string;
  contracts: Contract[];
}

export interface MarketEvent {
  id: string;
  title: string;
  category: string;
  competition: string;
  country: string;
  startTime: string;
  markets: Market[];
}

export interface EventsState {
  items: MarketEvent[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
