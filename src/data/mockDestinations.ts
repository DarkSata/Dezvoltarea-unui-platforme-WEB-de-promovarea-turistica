import { destinations as LEGACY_DESTINATIONS } from "./destinatii";
import type { Destination } from "../types/destination";

function normalizeId(id: string): string {
  return id === "cetatea-soroca" ? "soroca" : id;
}

export const MOCK_DESTINATIONS: Destination[] = LEGACY_DESTINATIONS.map((item) => ({
  id: normalizeId(item.id),
  name: item.name,
  area: item.region,
  cat: item.category,
  lat: item.lat,
  lng: item.lng,
  description: item.description,
  tips: item.tips,
  image: item.image,
}));
