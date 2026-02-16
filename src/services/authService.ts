/* File: src/services/authService.ts */
import type { SessionUser } from "../types/auth";
import { MOCK_USERS } from "../data/mockUsers";

const STORAGE_KEY = "mt.session.v1";

type Listener = () => void;

class AuthService {
    private listeners = new Set<Listener>();

    onChange(cb: Listener) {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }

    private emit() {
        this.listeners.forEach((cb) => cb());
    }

    getSession(): SessionUser | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as SessionUser;
        } catch {
            return null;
        }
    }

    login(username: string, password: string): SessionUser | null {
        const found = MOCK_USERS.find((u) => u.username === username && u.password === password);
        if (!found) return null;

        const session: SessionUser = { username: found.username, role: found.role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        this.emit();
        return session;
    }

    logout() {
        localStorage.removeItem(STORAGE_KEY);
        this.emit();
    }
}

export const authService = new AuthService();
