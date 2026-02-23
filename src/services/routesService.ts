import { ROUTES_CATALOG } from "../data/routes/routesCatalog";
import type {
  RouteCategory,
  RouteDurationFilter,
  RoutePoi,
  TouristRoute,
  TouristRouteInput,
} from "../types/routes";

const STORAGE_KEY = "moldova-travel.routes";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const uid = () =>
  `route_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;

const CATEGORY_SET: ReadonlySet<RouteCategory> = new Set<RouteCategory>([
  "Drumetie",
  "Ciclism",
  "Vinarii",
  "Natura",
  "Auto",
  "Autobuz",
]);

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

function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeLine(value: unknown, fallback: TouristRoute["line"]): TouristRoute["line"] {
  if (!Array.isArray(value) || value.length === 0) return fallback;

  const line = value
    .map((point) => {
      if (!Array.isArray(point)) return null;
      const lat = asFiniteNumber(point[0]);
      const lng = asFiniteNumber(point[1]);
      if (lat === null || lng === null) return null;
      return [lat, lng] as [number, number];
    })
    .filter((point): point is [number, number] => point !== null);

  return line.length > 0 ? line : fallback;
}

function normalizePillList(value: unknown, fallback: TouristRoute["topPills"]): TouristRoute["topPills"] {
  if (!Array.isArray(value) || value.length === 0) return fallback;

  const pills = value
    .map((pill) => {
      if (typeof pill !== "object" || pill === null) return null;
      const icon = "icon" in pill && typeof pill.icon === "string" ? pill.icon.trim() : "";
      const label = "label" in pill && typeof pill.label === "string" ? pill.label.trim() : "";
      if (!icon || !label) return null;
      return { icon, label };
    })
    .filter((pill): pill is { icon: string; label: string } => pill !== null);

  return pills.length > 0 ? pills : fallback;
}

function normalizePoints(value: unknown, fallback: RoutePoi[]): RoutePoi[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;

  const points = value
    .map<RoutePoi | null>((point) => {
      if (typeof point !== "object" || point === null) return null;

      const lat = asFiniteNumber("lat" in point ? point.lat : undefined);
      const lng = asFiniteNumber("lng" in point ? point.lng : undefined);
      const title = "title" in point && typeof point.title === "string" ? point.title.trim() : "";
      const desc = "desc" in point && typeof point.desc === "string" ? point.desc.trim() : "";
      const img =
        "img" in point && typeof point.img === "string" && point.img.trim().length > 0
          ? point.img.trim()
          : undefined;

      if (lat === null || lng === null || !title || !desc) return null;
      return { lat, lng, title, desc, img };
    })
    .filter((point): point is RoutePoi => point !== null);

  return points.length > 0 ? points : fallback;
}

function normalizeRouteItem(value: unknown, fallback: TouristRoute): TouristRoute {
  if (typeof value !== "object" || value === null) return fallback;

  const id = "id" in value && typeof value.id === "string" && value.id.trim() ? value.id : fallback.id;
  const title =
    "title" in value && typeof value.title === "string" && value.title.trim()
      ? value.title
      : fallback.title;
  const subtitle =
    "subtitle" in value && typeof value.subtitle === "string" && value.subtitle.trim()
      ? value.subtitle
      : fallback.subtitle;
  const details =
    "details" in value && typeof value.details === "string" && value.details.trim()
      ? value.details
      : fallback.details;
  const category =
    "category" in value && CATEGORY_SET.has(value.category as RouteCategory)
      ? (value.category as RouteCategory)
      : fallback.category;

  const durationRaw = "durationDays" in value ? value.durationDays : undefined;
  const durationDays = durationRaw === 1 || durationRaw === 2 || durationRaw === 3 ? durationRaw : fallback.durationDays;

  return {
    id,
    title,
    subtitle,
    details,
    category,
    durationDays,
    topPills: normalizePillList("topPills" in value ? value.topPills : undefined, fallback.topPills),
    bottomPills: normalizePillList(
      "bottomPills" in value ? value.bottomPills : undefined,
      fallback.bottomPills,
    ),
    line: normalizeLine("line" in value ? value.line : undefined, fallback.line),
    points: normalizePoints("points" in value ? value.points : undefined, fallback.points),
  };
}

class RoutesService {
  private ensureSeed() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ROUTES_CATALOG));
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ROUTES_CATALOG));
      return;
    }

    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ROUTES_CATALOG));
      return;
    }

    const parsedById = new Map(
      parsed
        .filter((item): item is TouristRoute => typeof item === "object" && item !== null && "id" in item)
        .map((item) => [item.id, item]),
    );
    const baseIds = new Set(ROUTES_CATALOG.map((item) => item.id));

    const mergedBase = ROUTES_CATALOG.map((seed) => {
      const existing = parsedById.get(seed.id);
      if (!existing) return seed;
      return normalizeRouteItem(existing, seed);
    });

    const customItems = parsed
      .filter((item): item is TouristRoute => {
        if (typeof item !== "object" || item === null) return false;
        if (!("id" in item) || typeof item.id !== "string") return false;
        return !baseIds.has(item.id);
      })
      .map((item) => normalizeRouteItem(item, ROUTES_CATALOG[0]));

    const next = [...mergedBase, ...customItems];
    if (JSON.stringify(next) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  private read(): TouristRoute[] {
    this.ensureSeed();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as TouristRoute[];
    } catch {
      return [];
    }
  }

  private write(data: TouristRoute[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async list(): Promise<TouristRoute[]> {
    await sleep(140);
    return this.read();
  }

  async query(options: RouteQuery = {}): Promise<RouteListResult> {
    await sleep(140);

    if (options.simulateError) {
      throw new Error("Simulated service error");
    }

    const search = options.search?.trim().toLowerCase() ?? "";
    const category = options.category ?? "Toate";
    const duration = options.duration ?? "toate";
    const sortBy = options.sortBy ?? "title-asc";
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.max(1, options.pageSize ?? 20);

    let rows = this.read().filter((item) => {
      const byCategory = category === "Toate" || item.category === category;
      const byDuration = duration === "toate" || item.durationDays === duration;
      const bySearch =
        search.length === 0 ||
        item.title.toLowerCase().includes(search) ||
        item.subtitle.toLowerCase().includes(search) ||
        item.details.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);

      return byCategory && byDuration && bySearch;
    });

    rows = [...rows].sort((left, right) => {
      if (sortBy === "title-desc") return right.title.localeCompare(left.title);
      if (sortBy === "duration-asc") return left.durationDays - right.durationDays;
      if (sortBy === "duration-desc") return right.durationDays - left.durationDays;
      return left.title.localeCompare(right.title);
    });

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  }

  async create(input: TouristRouteInput): Promise<TouristRoute> {
    await sleep(120);
    const next: TouristRoute = { id: uid(), ...input };
    const items = this.read();
    this.write([next, ...items]);
    return next;
  }

  async update(id: string, input: TouristRouteInput): Promise<TouristRoute | null> {
    await sleep(120);
    const items = this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const updated: TouristRoute = { id, ...input };
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

export const routesService = new RoutesService();
