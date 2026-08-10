import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { CompetitionSection } from "../components/CompetitionSection/CompetitionSection";
import { useEvents } from "../features/events/hooks/useEvents";
import type { MarketEvent } from "../features/events/types";

export function HomePage() {
  const { items, status, error } = useEvents();

  const competitionGroups = useMemo(() => {
    const groups = new Map<string, MarketEvent[]>();
    for (const event of items) {
      const group = groups.get(event.competition) ?? [];
      group.push(event);
      groups.set(event.competition, group);
    }
    return Array.from(groups.entries());
  }, [items]);

  if (status === "loading" || status === "idle") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Featured events
      </Typography>
      {competitionGroups.map(([competition, events]) => (
        <CompetitionSection key={competition} competition={competition} events={events} />
      ))}
    </>
  );
}
