export type UserRole = "admin" | "user";

export type AdminUser = {
  id: number;
  username: string;
  email: string | null;
  role: UserRole;
  createdAt: string;
};

export type UserUpdateInput = {
  username?: string;
  email?: string;
  role?: UserRole;
  password?: string;
};
