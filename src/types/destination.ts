// src/types/destination.ts

export type DestinationCategory =
    | "Natura"
    | "Vin"
    | "Manastiri"
    | "Istorie"
    | "Orase";

export type Destination = {
    id: string;
    name: string;
    
    cat: DestinationCategory;
    area: string;
    lat: number;
    lng: number;
    desc: string;
    tips: string;
    image?: string;
};

