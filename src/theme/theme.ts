import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

declare module "@mui/material/styles" {
  interface Palette {
    purple: Palette["primary"];
    yellow: Palette["primary"];
  }
  interface PaletteOptions {
    purple?: PaletteOptions["primary"];
    yellow?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    purple: true;
    yellow: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    purple: true;
    yellow: true;
  }
}

type BrandButtonColor = "primary" | "secondary" | "success" | "error" | "warning" | "info" | "purple" | "yellow";

const hoverByColor: Record<BrandButtonColor, string> = {
  primary: colors.hoverGreen,
  secondary: colors.hoverBlue,
  success: colors.hoverGreen,
  error: colors.hoverPink,
  warning: colors.hoverOrange,
  info: colors.hoverBlue,
  purple: colors.hoverPurple,
  yellow: colors.hoverYellow,
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryGreen,
      light: colors.lightGreen,
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.primaryBlue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    success: {
      main: colors.primaryGreen,
      light: colors.lightGreen,
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    error: {
      main: colors.primaryPink,
      light: colors.lightPink,
      dark: colors.darkPink,
      contrastText: colors.white,
    },
    warning: {
      main: colors.primaryOrange,
      light: colors.lightOrange,
      dark: colors.darkOrange,
      contrastText: colors.white,
    },
    info: {
      main: colors.primaryBlue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    purple: {
      main: colors.primaryPurple,
      light: colors.lightPurple,
      dark: colors.darkPurple,
      contrastText: colors.white,
    },
    yellow: {
      main: colors.primaryYellow,
      light: colors.lightYellow,
      dark: colors.darkYellow,
      contrastText: colors.black,
    },
    grey: {
      50: colors.lightGrey1,
      100: colors.lightGrey2,
      300: colors.grey1,
      400: colors.grey2,
      600: colors.darkGrey1,
      800: colors.darkGrey2,
    },
    common: {
      black: colors.black,
      white: colors.white,
    },
    text: {
      primary: colors.black,
      secondary: colors.darkGrey1,
    },
    background: {
      default: colors.lightGrey1,
      paper: colors.white,
    },
    divider: colors.grey1,
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 6px 10px 0 rgb(177 177 177 / 8%), 0 1px 3px 0 rgb(0 0 0 / 2%)",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 6px 18px 0 rgb(177 177 177 / 18%), 0 1px 11px 0 rgb(0 0 0 / 12%)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
      variants: (Object.entries(hoverByColor) as [BrandButtonColor, string][]).map(([color, hoverColor]) => ({
        props: { variant: "contained", color },
        style: {
          "&:hover": {
            backgroundColor: hoverColor,
          },
        },
      })),
    },
  },
});
