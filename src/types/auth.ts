/* File: src/types/auth.ts */
export type UserRole = "admin" | "user";

export type SessionUser = {
    username: string;
    role: UserRole;
};
