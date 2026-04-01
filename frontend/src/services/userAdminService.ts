import { api } from "./apiClient";
import type { AdminUser, UserUpdateInput } from "../types/user";

type UserListResponse = { items: AdminUser[]; total: number };

class UserAdminService {
  async getAll(): Promise<UserListResponse> {
    return api.get<UserListResponse>("/api/admin/users");
  }

  async update(id: number, input: UserUpdateInput): Promise<AdminUser> {
    return api.put<AdminUser>(`/api/admin/users/${id}`, input);
  }

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/users/${id}`);
  }
}

export const userAdminService = new UserAdminService();
