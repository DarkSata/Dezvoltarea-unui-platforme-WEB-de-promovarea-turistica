import { api } from "./apiClient";
import type { AdminUser, UserCreateInput, UserUpdateInput } from "../types/user";

type UserListResponse = { items: AdminUser[]; total: number };

class UserAdminService {
  async getAll(): Promise<UserListResponse> {
    return api.get<UserListResponse>("/api/admin/users");
  }

  async getById(id: number): Promise<AdminUser> {
    return api.get<AdminUser>(`/api/admin/users/${id}`);
  }

  async create(input: UserCreateInput): Promise<AdminUser> {
    return api.post<AdminUser>("/api/admin/users", input);
  }

  async update(id: number, input: UserUpdateInput): Promise<AdminUser> {
    return api.put<AdminUser>(`/api/admin/users/${id}`, input);
  }

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/users/${id}`);
  }
}

export const userAdminService = new UserAdminService();
