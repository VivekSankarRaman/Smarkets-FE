import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ContractChip } from "../ContractChip/ContractChip";
import type { Market } from "../../features/events/types";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Card sx={{ p: 2.5, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
        {market.name}
      </Typography>
      <Grid container rowSpacing={2} columnSpacing={4}>
        {market.contracts.map((contract) => (
          <Grid key={contract.id} size={{ xs: 12, md: 6 }}>
            <ContractChip contract={contract} variant="inline" />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
