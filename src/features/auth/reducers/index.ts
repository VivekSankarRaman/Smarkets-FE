import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../actions";
import { tokenStorage } from "../helpers/tokenStorage";
import type { AuthState } from "../types";

const initialState: AuthState = {
  token: tokenStorage.get(),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? action.error.message ?? "Login failed";
      })
      .addCase(logout.pending, (state) => {
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export default authSlice.reducer;
