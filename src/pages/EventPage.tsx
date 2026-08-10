import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";
import { MarketCard } from "../components/MarketCard/MarketCard";
import { formatEventStartTime } from "../features/events/helpers/formatEventStartTime";
import { useEventMarkets } from "../features/events/hooks/useEventMarkets";
import { useEvents } from "../features/events/hooks/useEvents";

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { items, status, error } = useEvents();
  useEventMarkets(eventId);

  const event = items.find((item) => item.id === eventId);
  const eventStartTime = event?.startTime;
  const startTime = useMemo(() => (eventStartTime ? formatEventStartTime(eventStartTime) : ""), [eventStartTime]);

  if (status === "loading" || status === "idle") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  if (!event) {
    return <Typography>Event not found.</Typography>;
  }

  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {event.category}
      </Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {event.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {startTime}
      </Typography>
      {event.markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </>
  );
}
