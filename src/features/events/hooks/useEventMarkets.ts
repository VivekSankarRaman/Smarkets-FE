import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchEventMarkets } from "../actions";

export function useEventMarkets(eventId: string | undefined) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.events.status);

  useEffect(() => {
    if (eventId && status === "succeeded") {
      dispatch(fetchEventMarkets(eventId));
    }
  }, [eventId, status, dispatch]);
}
