import { useState } from "react";
import type { FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/auth/actions";
import { paths } from "../routes/paths";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(login({ username, password, remember }));
    if (login.fulfilled.match(result)) {
      navigate(paths.home);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Log in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Email"
          type="email"
          autoComplete="username"
          fullWidth
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={<Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)} />}
          label="Remember me"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={status === "loading"}
        >
          {status === "loading" ? <CircularProgress size={24} /> : "Log in"}
        </Button>
      </Paper>
    </Container>
  );
}
