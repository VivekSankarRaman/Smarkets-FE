import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../helpers/api";
import { tokenStorage } from "../helpers/tokenStorage";
import type { LoginCredentials } from "../types";


export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  const response = await authApi.login(credentials);

  if (response.factor !== "complete" || !response.token) {
    return rejectWithValue(`Additional verification required (${response.factor}).`);
  }

  tokenStorage.set(response.token);
  return response.token;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  tokenStorage.clear();
  try {
    await authApi.logout();
  } catch {}
});
