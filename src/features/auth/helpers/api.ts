import { apiClient } from "../../../api/axiosClient";
import type { LoginCredentials, LoginResponse, LogoutResponse } from "../types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>("/v3/sessions/", credentials).then((res) => res.data),
  logout: () => apiClient.delete<LogoutResponse>("/v3/sessions/").then((res) => res.data),
};
