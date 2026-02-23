import { checklist } from "../data/home/checklist";

const STORAGE_KEY = "moldova-travel.guide-checklist";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const uid = () =>
  `guide_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

const GUIDE_SEED: GuideChecklistItem[] = checklist.map((item, index) => ({
  id: `guide-${index + 1}-${slugify(item.title)}`,
  title: item.title,
  description: item.description,
}));

class GuideService {
  private ensureSeed() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GUIDE_SEED));
      return;
    }

    let parsed: GuideChecklistItem[];
    try {
      parsed = JSON.parse(raw) as GuideChecklistItem[];
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GUIDE_SEED));
      return;
    }

    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GUIDE_SEED));
      return;
    }

    const normalized = parsed
      .filter((item) => typeof item === "object" && item !== null)
      .map((item, index) => ({
        id: typeof item.id === "string" && item.id.trim() ? item.id : `guide-${index + 1}-${uid()}`,
        title: typeof item.title === "string" ? item.title : "",
        description: typeof item.description === "string" ? item.description : "",
      }));

    if (JSON.stringify(normalized) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  }

  private read(): GuideChecklistItem[] {
    this.ensureSeed();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as GuideChecklistItem[];
    } catch {
      return [];
    }
  }

  private write(data: GuideChecklistItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async list(): Promise<GuideChecklistItem[]> {
    await sleep(120);
    return this.read();
  }

  async query(options: GuideQuery = {}): Promise<GuideListResult> {
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
        item.description.toLowerCase().includes(search)
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

  async create(input: GuideChecklistInput): Promise<GuideChecklistItem> {
    await sleep(120);
    const next: GuideChecklistItem = { id: uid(), ...input };
    const items = this.read();
    this.write([next, ...items]);
    return next;
  }

  async update(id: string, input: GuideChecklistInput): Promise<GuideChecklistItem | null> {
    await sleep(120);
    const items = this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: GuideChecklistItem = { id, ...input };
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

export const guideService = new GuideService();
