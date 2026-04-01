import { api } from "./apiClient";

export type GuideChecklistItem = {
  id: string;
  title: string;
  description: string;
};

export type GuideChecklistInput = Omit<GuideChecklistItem, "id">;

export type GuideSortBy = "title-asc" | "title-desc";

export type GuideQuery = {
  search?: string;
  sortBy?: GuideSortBy;
  page?: number;
  pageSize?: number;
  simulateError?: boolean;
};

export type GuideListResult = {
  items: GuideChecklistItem[];
  total: number;
  page: number;
  pageSize: number;
};

class GuideService {
  async list(): Promise<GuideChecklistItem[]> {
    const result = await this.query({ pageSize: 1000 });
    return result.items;
  }

  async query(options: GuideQuery = {}): Promise<GuideListResult> {
    if (options.simulateError) throw new Error("Simulated service error");

    const params = new URLSearchParams();
    if (options.search)   params.set("search",   options.search);
    if (options.sortBy)   params.set("sortBy",   options.sortBy);
    if (options.page)     params.set("page",     String(options.page));
    if (options.pageSize) params.set("pageSize", String(options.pageSize));

    const qs = params.toString();
    return api.get<GuideListResult>(`/api/guide${qs ? `?${qs}` : ""}`);
  }

  async create(input: GuideChecklistInput): Promise<GuideChecklistItem> {
    return api.post<GuideChecklistItem>("/api/guide", input);
  }

  async update(id: string, input: GuideChecklistInput): Promise<GuideChecklistItem | null> {
    try {
      return await api.put<GuideChecklistItem>(`/api/guide/${id}`, input);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/guide/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const guideService = new GuideService();
