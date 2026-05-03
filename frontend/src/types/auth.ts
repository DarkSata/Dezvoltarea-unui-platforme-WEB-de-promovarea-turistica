export type Role = "admin" | "user";

export type SessionUser = {
  username: string;
  role: Role;
};

export type UserProfile = {
  username: string;
  email: string | null;
  role: Role;
  createdAt: string;
};

export type UserProfileUpdateInput = {
  username?: string;
  email?: string;
};

export type UserProfileUpdateResponse = UserProfile & {
  token: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};
