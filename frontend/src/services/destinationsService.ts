import { api } from "./apiClient";
import type { Destination, DestinationCategory, DestinationInput } from "../types/destination";

export type DestinationQuery = {
  search?: string;
  category?: "Toate" | DestinationCategory;
  sortBy?: "name-asc" | "name-desc" | "area-asc" | "area-desc";
  page?: number;
  pageSize?: number;
  simulateError?: boolean;
};

export type DestinationListResult = {
  items: Destination[];
  total: number;
  page: number;
  pageSize: number;
};

class DestinationsService {
  async list(): Promise<Destination[]> {
    const result = await this.query({ pageSize: 1000 });
    return result.items;
  }

  async query(options: DestinationQuery = {}): Promise<DestinationListResult> {
    if (options.simulateError) throw new Error("Simulated service error");

    const params = new URLSearchParams();
    if (options.search)   params.set("search",   options.search);
    if (options.category && options.category !== "Toate") params.set("category", options.category);
    if (options.sortBy)   params.set("sortBy",   options.sortBy);
    if (options.page)     params.set("page",     String(options.page));
    if (options.pageSize) params.set("pageSize", String(options.pageSize));

    const qs = params.toString();
    return api.get<DestinationListResult>(`/api/destinations${qs ? `?${qs}` : ""}`);
  }

  async create(input: DestinationInput): Promise<Destination> {
    return api.post<Destination>("/api/destinations", input);
  }

  async update(id: string, input: DestinationInput): Promise<Destination | null> {
    try {
      return await api.put<Destination>(`/api/destinations/${id}`, input);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/destinations/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const destinationsService = new DestinationsService();
