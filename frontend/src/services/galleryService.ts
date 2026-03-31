import { api } from "./apiClient";

export type GalleryTheme = "galerie-sunset" | "galerie-vin" | "galerie-nistru";

export type GalleryBlock = {
  id: string;
  title: string;
  subtitle: string;
  theme: GalleryTheme;
};

export type GalleryBlockInput = Omit<GalleryBlock, "id">;

export type GallerySortBy = "title-asc" | "title-desc";

export type GalleryQuery = {
  search?: string;
  sortBy?: GallerySortBy;
  page?: number;
  pageSize?: number;
  simulateError?: boolean;
};

export type GalleryListResult = {
  items: GalleryBlock[];
  total: number;
  page: number;
  pageSize: number;
};

class GalleryService {
  async list(): Promise<GalleryBlock[]> {
    const result = await this.query({ pageSize: 1000 });
    return result.items;
  }

  async query(options: GalleryQuery = {}): Promise<GalleryListResult> {
    if (options.simulateError) throw new Error("Simulated service error");

    const params = new URLSearchParams();
    if (options.search)   params.set("search",   options.search);
    if (options.sortBy)   params.set("sortBy",   options.sortBy);
    if (options.page)     params.set("page",     String(options.page));
    if (options.pageSize) params.set("pageSize", String(options.pageSize));

    const qs = params.toString();
    return api.get<GalleryListResult>(`/api/gallery${qs ? `?${qs}` : ""}`);
  }

  async create(input: GalleryBlockInput): Promise<GalleryBlock> {
    return api.post<GalleryBlock>("/api/gallery", input);
  }

  async update(id: string, input: GalleryBlockInput): Promise<GalleryBlock | null> {
    try {
      return await api.put<GalleryBlock>(`/api/gallery/${id}`, input);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/gallery/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const galleryService = new GalleryService();
