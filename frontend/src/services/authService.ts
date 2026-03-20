import { api } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/api/auth/login", { email, password });
    return res.data;
  },
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/api/auth/signup", { name, email, password });
    return res.data;
  },
  async me(token: string): Promise<{ user: AuthUser }> {
    const res = await api.get<{ user: AuthUser }>("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
