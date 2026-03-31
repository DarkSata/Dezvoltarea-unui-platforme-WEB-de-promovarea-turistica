export type DestinationCategory =
  | "Natura"
  | "Vin"
  | "Manastiri"
  | "Istorie"
  | "Orase";

export type Destination = {
  id: string;
  name: string;
  area: string;
  cat: DestinationCategory;
  lat: number;
  lng: number;
  description: string;
  tips: string;
  image?: string;
};

export type DestinationInput = Omit<Destination, "id">;
