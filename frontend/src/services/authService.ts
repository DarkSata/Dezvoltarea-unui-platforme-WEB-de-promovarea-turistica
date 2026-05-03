import { api, clearToken, storeToken } from "./apiClient";
import type {
  ChangePasswordInput,
  SessionUser,
  UserProfile,
  UserProfileUpdateInput,
  UserProfileUpdateResponse,
} from "../types/auth";

type Listener = () => void;
type LoginResponse = { token: string; username: string; role: string };

const SESSION_KEY = "moldova-travel.auth";

class AuthService {
  private listeners = new Set<Listener>();

  onChange(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  getSession(): SessionUser | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }

  async login(username: string, password: string): Promise<SessionUser | null> {
    try {
      const res = await api.post<LoginResponse>("/api/auth/login", { username, password });
      storeToken(res.token);
      const session: SessionUser = {
        username: res.username,
        role: res.role as SessionUser["role"],
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      this.emit();
      return session;
    } catch {
      return null;
    }
  }

  async register(username: string, password: string): Promise<{ user: SessionUser | null; error?: string }> {
    try {
      const res = await api.post<LoginResponse>("/api/auth/register", { username, password });
      storeToken(res.token);
      const session: SessionUser = {
        username: res.username,
        role: res.role as SessionUser["role"],
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      this.emit();
      return { user: session };
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      return { user: null, error: msg ?? "Eroare la înregistrare." };
    }
  }

  async getProfile(): Promise<UserProfile> {
    return api.get<UserProfile>("/api/users/me");
  }

  async updateProfile(input: UserProfileUpdateInput): Promise<UserProfileUpdateResponse> {
    const profile = await api.put<UserProfileUpdateResponse>("/api/users/me", input);
    storeToken(profile.token);
    const session: SessionUser = {
      username: profile.username,
      role: profile.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.emit();
    return profile;
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await api.put("/api/users/me/password", input);
  }

  async deleteAccount(): Promise<void> {
    await api.delete("/api/users/me");
    clearToken();
    localStorage.removeItem(SESSION_KEY);
    this.emit();
  }

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // clear locally regardless of API response
    }
    clearToken();
    localStorage.removeItem(SESSION_KEY);
    this.emit();
  }
}

export const authService = new AuthService();
