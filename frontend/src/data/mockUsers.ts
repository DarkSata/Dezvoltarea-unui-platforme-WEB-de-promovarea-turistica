import type { Role, SessionUser } from "../types/auth";

export type MockUser = SessionUser & {
  password: string;
};

export const MOCK_USERS: MockUser[] = [
  { username: "admin", password: "admin123", role: "admin" as Role },
  { username: "user", password: "user123", role: "user" as Role },
];
