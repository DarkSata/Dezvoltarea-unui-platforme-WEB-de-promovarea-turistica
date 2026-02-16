import { MOCK_USERS } from "../data/mockUsers";
import type { SessionUser } from "../types/auth";

type Listener = () => void;

class AuthService {
  private readonly storageKey = "moldova-travel.auth";
  private listeners = new Set<Listener>();

  onChange(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  getSession(): SessionUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }

  login(username: string, password: string): SessionUser | null {
    const account = MOCK_USERS.find(
      (user) => user.username === username && user.password === password,
    );
    if (!account) return null;

    const session: SessionUser = {
      username: account.username,
      role: account.role,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.emit();
    return session;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.emit();
  }
}

export const authService = new AuthService();
