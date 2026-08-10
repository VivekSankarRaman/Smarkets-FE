export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export type AuthFactor = "complete" | "totp" | "nemid";

export interface LoginResponse {
  token: string | null;
  stop: string;
  factor: AuthFactor;
  verify: boolean;
}

export interface LogoutResponse {
  success: boolean;
}

export interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
