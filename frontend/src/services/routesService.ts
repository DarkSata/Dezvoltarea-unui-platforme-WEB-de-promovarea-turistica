import { api } from "./apiClient";
import type { RouteCategory, RouteDurationFilter, TouristRoute, TouristRouteInput } from "../types/routes";

type RouteSortBy = "title-asc" | "title-desc" | "duration-asc" | "duration-desc";

export type RouteQuery = {
  search?: string;
  category?: "Toate" | RouteCategory;
  duration?: RouteDurationFilter;
  sortBy?: RouteSortBy;
  page?: number;
  pageSize?: number;
  simulateError?: boolean;
};

export type RouteListResult = {
  items: TouristRoute[];
  total: number;
  page: number;
  pageSize: number;
};

class RoutesService {
  async list(): Promise<TouristRoute[]> {
    const result = await this.query({ pageSize: 1000 });
    return result.items;
  }

  async query(options: RouteQuery = {}): Promise<RouteListResult> {
    if (options.simulateError) throw new Error("Simulated service error");

    const params = new URLSearchParams();
    if (options.search)   params.set("search",   options.search);
    if (options.category && options.category !== "Toate") params.set("category", options.category);
    if (options.duration && options.duration !== "toate")  params.set("duration", String(options.duration));
    if (options.sortBy)   params.set("sortBy",   options.sortBy);
    if (options.page)     params.set("page",     String(options.page));
    if (options.pageSize) params.set("pageSize", String(options.pageSize));

    const qs = params.toString();
    return api.get<RouteListResult>(`/api/routes${qs ? `?${qs}` : ""}`);
  }

  async create(input: TouristRouteInput): Promise<TouristRoute> {
    return api.post<TouristRoute>("/api/routes", input);
  }

  async update(id: string, input: TouristRouteInput): Promise<TouristRoute | null> {
    try {
      return await api.put<TouristRoute>(`/api/routes/${id}`, input);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/routes/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const routesService = new RoutesService();
