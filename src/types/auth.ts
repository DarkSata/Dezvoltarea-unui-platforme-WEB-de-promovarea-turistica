export type Role = "admin" | "user";

export type SessionUser = {
  username: string;
  role: Role;
};
