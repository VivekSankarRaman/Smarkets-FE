import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { fetchLatestPrices } from "../actions";

const TICK_INTERVAL_MS = 7000;

export function usePriceTicker() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchLatestPrices());
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [dispatch]);
}
