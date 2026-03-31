import type { LatLngTuple } from "leaflet";

export type RouteCategory =
  | "Drumetie"
  | "Ciclism"
  | "Vinarii"
  | "Natura"
  | "Auto"
  | "Autobuz";

export type RouteFilter = "toate" | RouteCategory;
export type RouteDurationFilter = "toate" | 1 | 2 | 3;

export type RoutePill = {
  icon: string;
  label: string;
};

export type RoutePoi = {
  lat: number;
  lng: number;
  title: string;
  desc: string;
  img?: string;
};

export type TouristRoute = {
  id: string;
  category: RouteCategory;
  durationDays: 1 | 2 | 3;
  title: string;
  subtitle: string;
  topPills: RoutePill[];
  bottomPills: RoutePill[];
  details: string;
  line: LatLngTuple[];
  points: RoutePoi[];
};

export type TouristRouteInput = Omit<TouristRoute, "id">;
