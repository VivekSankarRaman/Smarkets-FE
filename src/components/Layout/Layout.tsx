import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, Outlet } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/actions";
import { usePriceTicker } from "../../features/events/hooks/usePriceTicker";
import { paths } from "../../routes/paths";

export function Layout() {
  const dispatch = useAppDispatch();
  usePriceTicker();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Betting Exchange
          </Typography>
          <Button color="inherit" component={Link} to={paths.home}>
            Home
          </Button>
          <Button color="inherit" onClick={() => dispatch(logout())}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
