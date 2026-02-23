import { galleryItems } from "../data/home/galleryItems";

const STORAGE_KEY = "moldova-travel.gallery-items";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const uid = () =>
  `gallery_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;

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

const THEME_BY_LEGACY_ID: Record<string, GalleryTheme> = {
  "galerie-sunset": "galerie-sunset",
  "galerie-vin": "galerie-vin",
  "galerie-nistru": "galerie-nistru",
};

const GALLERY_SEED: GalleryBlock[] = galleryItems.map((item, index) => ({
  id: `gallery-seed-${index + 1}`,
  title: item.title,
  subtitle: item.subtitle,
  theme: THEME_BY_LEGACY_ID[item.id] ?? "galerie-sunset",
}));

function normalizeTheme(value: unknown): GalleryTheme {
  if (value === "galerie-vin") return "galerie-vin";
  if (value === "galerie-nistru") return "galerie-nistru";
  return "galerie-sunset";
}

class GalleryService {
  private ensureSeed() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_SEED));
      return;
    }

    let parsed: GalleryBlock[];
    try {
      parsed = JSON.parse(raw) as GalleryBlock[];
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_SEED));
      return;
    }

    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_SEED));
      return;
    }

    const normalized = parsed
      .filter((item) => typeof item === "object" && item !== null)
      .map((item, index) => ({
        id: typeof item.id === "string" && item.id.trim() ? item.id : `gallery-${index + 1}-${uid()}`,
        title: typeof item.title === "string" ? item.title : "",
        subtitle: typeof item.subtitle === "string" ? item.subtitle : "",
        theme: normalizeTheme(item.theme),
      }));

    if (JSON.stringify(normalized) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  }

  private read(): GalleryBlock[] {
    this.ensureSeed();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as GalleryBlock[];
    } catch {
      return [];
    }
  }

  private write(data: GalleryBlock[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async list(): Promise<GalleryBlock[]> {
    await sleep(120);
    return this.read();
  }

  async query(options: GalleryQuery = {}): Promise<GalleryListResult> {
    await sleep(120);

    if (options.simulateError) {
      throw new Error("Simulated service error");
    }

    const search = options.search?.trim().toLowerCase() ?? "";
    const sortBy = options.sortBy ?? "title-asc";
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.max(1, options.pageSize ?? 50);

    let rows = this.read().filter((item) => {
      if (!search) return true;
      return (
        item.title.toLowerCase().includes(search) ||
        item.subtitle.toLowerCase().includes(search) ||
        item.theme.toLowerCase().includes(search)
      );
    });

    rows = [...rows].sort((left, right) => {
      if (sortBy === "title-desc") return right.title.localeCompare(left.title);
      return left.title.localeCompare(right.title);
    });

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  }

  async create(input: GalleryBlockInput): Promise<GalleryBlock> {
    await sleep(120);
    const next: GalleryBlock = { id: uid(), ...input };
    const items = this.read();
    this.write([next, ...items]);
    return next;
  }

  async update(id: string, input: GalleryBlockInput): Promise<GalleryBlock | null> {
    await sleep(120);
    const items = this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: GalleryBlock = { id, ...input };
    items[index] = updated;
    this.write(items);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    await sleep(120);
    const items = this.read();
    const next = items.filter((item) => item.id !== id);
    this.write(next);
    return next.length !== items.length;
  }
}

export const galleryService = new GalleryService();
