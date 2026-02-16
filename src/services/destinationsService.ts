/* File: src/services/destinationsService.ts */
import type { Destination } from "../types/destination";
import { mockDestinations } from "../data/mockDestinations";

const STORAGE_KEY = "mt.destinations.v1";

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function uid(prefix = "d") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

type LoadResult =
    | { ok: true; data: Destination[] }
    | { ok: false; code: 500; message: string };

class DestinationsService {
    private ensureSeed() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDestinations));
    }

    async list(): Promise<LoadResult> {
        this.ensureSeed();
        await sleep(250);

        // симуляция редкой ошибки, чтобы закрыть "error state"
        if (Math.random() < 0.03) {
            return { ok: false, code: 500, message: "Server error (simulated)" };
        }

        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Destination[];
        return { ok: true, data };
    }

    async create(input: Omit<Destination, "id">): Promise<Destination> {
        this.ensureSeed();
        await sleep(200);

        const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Destination[];
        const next: Destination = { id: uid(), ...input };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...items]));
        return next;
    }

    async update(id: string, patch: Omit<Destination, "id">): Promise<Destination | null> {
        this.ensureSeed();
        await sleep(200);

        const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Destination[];
        const idx = items.findIndex((x) => x.id === id);
        if (idx < 0) return null;

        const updated: Destination = { id, ...patch };
        items[idx] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return updated;
    }

    async remove(id: string): Promise<boolean> {
        this.ensureSeed();
        await sleep(150);

        const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Destination[];
        const next = items.filter((x) => x.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next.length !== items.length;
    }
}

export const destinationsService = new DestinationsService();
