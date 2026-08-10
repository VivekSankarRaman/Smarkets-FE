import axios from "axios";
import { tokenStorage } from "../features/auth/helpers/tokenStorage";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Session-Token ${token}`;
  }
  return config;
});
