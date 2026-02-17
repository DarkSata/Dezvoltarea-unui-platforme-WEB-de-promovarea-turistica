import { MOCK_DESTINATIONS } from "../data/mockDestinations";
import type {
  Destination,
  DestinationCategory,
  DestinationInput,
} from "../types/destination";

const STORAGE_KEY = "moldova-travel.destinations";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const uid = () =>
  `dest_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;

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
  private ensureSeed() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DESTINATIONS));
  }

  private read(): Destination[] {
    this.ensureSeed();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as Destination[];
    } catch {
      return [];
    }
  }

  private write(data: Destination[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async list(): Promise<Destination[]> {
    await sleep(140);
    return this.read();
  }

  async query(options: DestinationQuery = {}): Promise<DestinationListResult> {
    await sleep(140);

    if (options.simulateError) {
      throw new Error("Simulated service error");
    }

    const search = options.search?.trim().toLowerCase() ?? "";
    const category = options.category ?? "Toate";
    const sortBy = options.sortBy ?? "name-asc";
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.max(1, options.pageSize ?? 20);

    let rows = this.read().filter((item) => {
      const byCategory = category === "Toate" || item.cat === category;
      const bySearch =
        search.length === 0 ||
        item.name.toLowerCase().includes(search) ||
        item.area.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.tips.toLowerCase().includes(search);

      return byCategory && bySearch;
    });

    rows = [...rows].sort((left, right) => {
      if (sortBy === "name-desc") return right.name.localeCompare(left.name);
      if (sortBy === "area-asc") return left.area.localeCompare(right.area);
      if (sortBy === "area-desc") return right.area.localeCompare(left.area);
      return left.name.localeCompare(right.name);
    });

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  }

  async create(input: DestinationInput): Promise<Destination> {
    await sleep(120);
    const next: Destination = { id: uid(), ...input };
    const items = this.read();
    this.write([next, ...items]);
    return next;
  }

  async update(id: string, input: DestinationInput): Promise<Destination | null> {
    await sleep(120);
    const items = this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: Destination = { id, ...input };
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

export const destinationsService = new DestinationsService();
