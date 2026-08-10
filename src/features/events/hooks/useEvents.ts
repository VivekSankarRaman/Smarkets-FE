import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchEvents } from "../actions";

export function useEvents() {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events);

  useEffect(() => {
    if (events.status === "idle") {
      dispatch(fetchEvents());
    }
  }, [events.status, dispatch]);

  return events;
}
