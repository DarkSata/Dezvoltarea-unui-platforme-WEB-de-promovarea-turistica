/* File: src/data/mockDestinations.ts */
import type { Destination } from "../types/destination";

export const mockDestinations: Destination[] = [
    {
        id: "orheiul-vechi",
        name: "Orheiul Vechi",
        area: "Orhei",
        cat: "Istorie",
        lat: 47.3,
        lng: 28.971,
        desc: "Complex cultural-natural cu priveliști superbe și trasee ușoare.",
        tips: "Cel mai fain la apus. Ia încălțăminte comodă.",
    },
    {
        id: "cricova",
        name: "Cricova",
        area: "Chișinău",
        cat: "Vin",
        lat: 47.1407,
        lng: 28.8637,
        desc: "Oraș subteran al vinului, perfect pentru tururi și degustări.",
        tips: "Rezervă turul din timp; e răcoare în galerii.",
    },
    {
        id: "tipova",
        name: "Țipova",
        area: "Rezina",
        cat: "Manastiri",
        lat: 47.6146,
        lng: 28.9832,
        desc: "Mănăstire rupestră pe Nistru + panorame și natură sălbatică.",
        tips: "Trasee pe stâncă: atenție la vreme.",
    },
    {
        id: "soroca",
        name: "Cetatea Soroca",
        area: "Soroca",
        cat: "Istorie",
        lat: 48.1582,
        lng: 28.2962,
        desc: "Fortăreață medievală pe malul Nistrului, super fotogenică.",
        tips: "Combină cu „Lumânarea Recunoștinței” și Nistrul.",
    },
    {
        id: "codrii",
        name: "Codrii",
        area: "Strășeni",
        cat: "Natura", // ✅ было category
        lat: 47.1008,
        lng: 28.422,
        desc: "Păduri, aer curat și plimbări relaxante aproape de Chișinău.",
        tips: "Perfectă pentru o plimbare de weekend.",
    },
    {
        id: "mimi",
        name: "Castel Mimi",
        area: "Anenii Noi",
        cat: "Vin", // ✅ было category
        lat: 46.9987,
        lng: 29.0586,
        desc: "Arhitectură elegantă, vin, gastronomie și evenimente.",
        tips: "Merită tur + prânz; rezervare recomandată.",
    },
];
