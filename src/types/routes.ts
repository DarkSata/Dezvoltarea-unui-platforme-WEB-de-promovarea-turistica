import type { LatLngTuple } from "leaflet";

export type RouteCategory =
  | "Drumeție"
  | "Ciclism"
  | "Vinării"
  | "Natură"
  | "Auto"
  | "Autobuz";

export type RouteFilter = "toate" | RouteCategory;

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
  title: string;
  subtitle: string;
  topPills: RoutePill[];
  bottomPills: RoutePill[];
  details: string;
  line: LatLngTuple[];
  points: RoutePoi[];
};
