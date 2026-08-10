import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import { ClockIcon } from "../icons/ClockIcon";
import { JerseyIcon } from "../icons/JerseyIcon";
import { ContractChip } from "../ContractChip/ContractChip";
import { formatEventStartTime } from "../../features/events/helpers/formatEventStartTime";
import type { MarketEvent } from "../../features/events/types";

interface EventRowProps {
  event: MarketEvent;
}

export function EventRow({ event }: EventRowProps) {
  const featuredMarket = event.markets[0];
  const [homeName, awayName] = event.title.split(" vs ");
  const startTime = useMemo(() => formatEventStartTime(event.startTime), [event.startTime]);

  return (
    <Card>
      <CardActionArea component={Link} to={`/events/${event.id}`} sx={{ px: 2.5, py: 2 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 1.5, lg: 3 }}
          sx={{ alignItems: { xs: "flex-start", lg: "center" }, justifyContent: "space-between" }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <JerseyIcon fontSize="small" color="disabled" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {homeName ?? event.title}
              </Typography>
            </Stack>
            {awayName && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <JerseyIcon fontSize="small" color="disabled" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {awayName}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary", pt: 0.5 }}>
              <ClockIcon fontSize="inherit" />
              <Typography variant="caption">{startTime}</Typography>
              <Typography variant="caption">•</Typography>
              <Typography variant="caption">{event.country}</Typography>
            </Stack>
          </Stack>
          {featuredMarket && (
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
              {featuredMarket.contracts.map((contract) => (
                <ContractChip key={contract.id} contract={contract} />
              ))}
            </Stack>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
