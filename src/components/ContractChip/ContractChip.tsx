import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { Contract } from "../../features/events/types";

type PriceDirection = "up" | "down" | null;

const FLASH_DURATION_MS = 700;

interface ContractChipProps {
  contract: Contract;
  variant?: "stacked" | "inline";
}

export function ContractChip({ contract, variant = "stacked" }: ContractChipProps) {
  const previousPrice = useRef(contract.price);
  const [direction, setDirection] = useState<PriceDirection>(null);

  useEffect(() => {
    if (contract.price > previousPrice.current) {
      setDirection("up");
    } else if (contract.price < previousPrice.current) {
      setDirection("down");
    }
    previousPrice.current = contract.price;

    const timeout = setTimeout(() => setDirection(null), FLASH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [contract.price]);

  const priceChip = (
    <Chip
      label={contract.price}
      color={direction === "up" ? "success" : direction === "down" ? "error" : "default"}
      variant={direction ? "filled" : "outlined"}
      sx={{ fontWeight: 700, fontSize: "0.95rem", px: 1, transition: "background-color 0.3s ease" }}
    />
  );

  if (variant === "inline") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="body2">{contract.name}</Typography>
        {priceChip}
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", minWidth: 76 }}>
      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block", mb: 0.5 }}>
        {contract.name}
      </Typography>
      {priceChip}
    </Box>
  );
}
