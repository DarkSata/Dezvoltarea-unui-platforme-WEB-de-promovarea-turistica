/* File: src/data/mockUsers.ts */
import type { SessionUser } from "../types/auth";

export const MOCK_USERS: Array<SessionUser & { password: string }> = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" },
];
