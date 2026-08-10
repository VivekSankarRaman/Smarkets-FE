import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EventRow } from "../EventRow/EventRow";
import type { MarketEvent } from "../../features/events/types";

interface CompetitionSectionProps {
  competition: string;
  events: MarketEvent[];
}

export function CompetitionSection({ competition, events }: CompetitionSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {competition}
        </Typography>
        <Chip label={events.length} size="small" />
      </Stack>
      <Stack spacing={1.5}>
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </Stack>
    </Box>
  );
}
