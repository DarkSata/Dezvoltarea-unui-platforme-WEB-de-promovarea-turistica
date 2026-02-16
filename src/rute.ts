/* File: src/rute.ts */
/* global L */
declare const L: any;

type LatLngTuple = [number, number];

type Poi = {
    lat: number;
    lng: number;
    title: string;
    desc: string;
    img?: string;
};

type Route = {
    line: LatLngTuple[];
    points: Poi[];
};

function byId<T extends HTMLElement>(id: string): T | null {
    const el = document.getElementById(id);
    return el instanceof HTMLElement ? (el as T) : null;
}

function commonsImg(fileName: string, width = 900): string {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
        fileName
    )}?width=${width}`;
}

const FALLBACK_IMG = commonsImg("Moldova_Orheiul_Vechi.jpg", 900);

function openPoiPanel(poi: Poi): void {
    const panel = byId<HTMLElement>("poiPanel");
    const img = byId<HTMLImageElement>("poiImg");
    const title = byId<HTMLElement>("poiTitle");
    const text = byId<HTMLElement>("poiText");

    if (!panel) return;
    panel.classList.add("open");

    if (img) {
        img.onerror = null;
        img.onerror = () => {
            img.src = FALLBACK_IMG;
        };

        const src = poi.img
            ? poi.img.startsWith("http")
                ? poi.img
                : commonsImg(poi.img, 900)
            : FALLBACK_IMG;

        img.src = src;
        img.alt = poi.title ? `Imagine: ${poi.title}` : "Imagine punct de oprire";
    }

    if (title) title.textContent = poi.title || "Punct de oprire";
    if (text) text.textContent = poi.desc || "";
}

function closePoiPanel(): void {
    const panel = byId<HTMLElement>("poiPanel");
    if (!panel) return;
    panel.classList.remove("open");
}

const routes: Record<string, Route> = {
    "mircești": {
        line: [
            [47.038, 27.833],
            [47.101, 27.92],
            [47.215, 28.01],
        ],
        points: [
            {
                lat: 47.038,
                lng: 27.833,
                title: "Mircești (Start)",
                desc: "Punct de start într-o zonă rurală liniștită, cu atmosferă autentică.",
                img: "Codrii_dolna.jpg",
            },
            {
                lat: 47.101,
                lng: 27.92,
                title: "Oprire vitivinicolă",
                desc: "Oprire pentru degustare/relax – vin local și gustări tradiționale.",
                img: "Cricova_Wine_Cellar_Collection.jpg",
            },
            {
                lat: 47.215,
                lng: 28.01,
                title: "Sculeni (Final)",
                desc: "Final de traseu cu peisaje deschise și atmosferă liniștită.",
                img: "Prut_River.jpg",
            },
        ],
    },

    palanca: {
        line: [
            [46.412, 30.094],
            [46.445, 30.135],
            [46.48, 30.18],
        ],
        points: [
            {
                lat: 46.412,
                lng: 30.094,
                title: "Palanca (Start)",
                desc: "Pornire pe drumuri liniștite, potrivite pentru ciclism recreativ.",
                img: "Codrii_01.jpg",
            },
            {
                lat: 46.445,
                lng: 30.135,
                title: "Punct foto / pauză",
                desc: "Loc bun pentru o pauză scurtă și poze cu peisajele deschise.",
                img: "Prut_River.jpg",
            },
            {
                lat: 46.48,
                lng: 30.18,
                title: "Final traseu",
                desc: "Final de rută — recomandată o pauză și hidratare înainte de întoarcere.",
                img: "Codrii_dolna.jpg",
            },
        ],
    },

    codrii: {
        line: [
            [47.15, 28.4],
            [47.18, 28.43],
            [47.21, 28.46],
        ],
        points: [
            {
                lat: 47.15,
                lng: 28.4,
                title: "Intrare Codrii",
                desc: "Început de drumeție prin pădure, ideal pentru plimbare lejeră.",
                img: "Codrii_01.jpg",
            },
            {
                lat: 47.18,
                lng: 28.43,
                title: "Poiană / picnic",
                desc: "Loc bun pentru picnic și pauză în aer liber.",
                img: "Codrii_dolna.jpg",
            },
            {
                lat: 47.21,
                lng: 28.46,
                title: "Punct panoramic",
                desc: "Punct cu vedere bună — perfect pentru poze și apus.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
        ],
    },

    saharna: {
        line: [
            [47.69, 28.965],
            [47.65, 28.995],
            [47.6, 29.02],
        ],
        points: [
            {
                lat: 47.69,
                lng: 28.965,
                title: "Saharna",
                desc: "Zonă cunoscută pentru cascade și poteci în natură.",
                img: "The_waterfall_in_Saharna_(190160440).jpg",
            },
            {
                lat: 47.65,
                lng: 28.995,
                title: "Belvedere",
                desc: "Punct de belvedere cu panorame bune asupra reliefului.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 47.6,
                lng: 29.02,
                title: "Țipova",
                desc: "Zonă spectaculoasă pe Nistru — peisaje și atmosferă liniștită.",
                img: "Tipova_Monastery.jpg",
            },
        ],
    },

    prut: {
        line: [
            [47.5, 28.0],
            [47.52, 28.02],
            [47.54, 28.04],
        ],
        points: [
            {
                lat: 47.5,
                lng: 28.0,
                title: "Lunca Prutului (Start)",
                desc: "Zonă de luncă — bună pentru plimbări lente și observarea păsărilor.",
                img: "Prut_River.jpg",
            },
            {
                lat: 47.52,
                lng: 28.02,
                title: "Punct de observare",
                desc: "Loc ideal pentru binoclu și fotografie de natură (mai ales dimineața).",
                img: "Prut_River_in_Winter1.jpg",
            },
            {
                lat: 47.54,
                lng: 28.04,
                title: "Zonă de odihnă",
                desc: "Final lejer — pauză, hidratare și revenire pe traseu.",
                img: "Prut_River.jpg",
            },
        ],
    },

    "auto-vin": {
        line: [
            [47.0105, 28.8638],
            [47.1415, 28.857],
            [46.9885, 29.0845],
        ],
        points: [
            {
                lat: 47.0105,
                lng: 28.8638,
                title: "Chișinău (Start)",
                desc: "Punct de plecare — recomandat să pornești dimineața pentru tururi.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 47.1415,
                lng: 28.857,
                title: "Cricova",
                desc: "Crame subterane + degustare. Recomandat cu rezervare.",
                img: "Cricova_Wine_Cellar_Collection.jpg",
            },
            {
                lat: 46.9885,
                lng: 29.0845,
                title: "Castel Mimi",
                desc: "Vin & gastronomie, atmosferă premium.",
                img: "Vinoteca_Națională.JPG",
            },
        ],
    },

    "auto-orhei": {
        line: [
            [47.0105, 28.8638],
            [47.303, 28.98],
            [47.3075, 28.966],
        ],
        points: [
            {
                lat: 47.0105,
                lng: 28.8638,
                title: "Chișinău (Start)",
                desc: "Punct de plecare — apă și încălțăminte comodă recomandate.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 47.303,
                lng: 28.98,
                title: "Orheiul Vechi",
                desc: "Complex natural și cultural celebru, cu panorame superbe.",
                img: "Orhei_Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 47.3075,
                lng: 28.966,
                title: "Butuceni",
                desc: "Sat autentic cu pensiuni și mâncare tradițională (bun pentru prânz).",
                img: "Orheiul_Vechi_-_Moldova_(by_David_Stanley).jpg",
            },
        ],
    },

    "bus-vin": {
        line: [
            [47.0105, 28.8638],
            [46.9167, 28.805],
            [47.0105, 28.8638],
        ],
        points: [
            {
                lat: 47.0105,
                lng: 28.8638,
                title: "Chișinău (Plecare)",
                desc: "Punct de plecare pentru tur organizat — comod, fără condus.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 46.9167,
                lng: 28.805,
                title: "Mileștii Mici",
                desc: "Tur ghidat în galerii + degustare. Rezervare recomandată în weekend.",
                img: "Caves_Milestii_Mici_Moldavie.jpg",
            },
            {
                lat: 47.0105,
                lng: 28.8638,
                title: "Chișinău (Întoarcere)",
                desc: "Revenire în oraș — perfect pentru plimbare și cină.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
        ],
    },

    "auto-soroca": {
        line: [
            [47.0105, 28.8638],
            [47.744, 28.965],
        ],
        points: [
            {
                lat: 47.0105,
                lng: 28.8638,
                title: "Chișinău (Start)",
                desc: "Rută mai lungă — plecare dimineața devreme recomandată.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 47.744,
                lng: 28.965,
                title: "Soroca",
                desc: "Cetatea Soroca + priveliști pe Nistru. Bună pentru istorie și fotografie.",
                img: "Soroca_fortress_front.jpg",
            },
        ],
    },

    "auto-sud": {
        line: [
            [47.0105, 28.8638],
            [46.53, 28.78],
            [46.3, 28.65],
            [45.9, 28.19],
        ],
        points: [
            {
                lat: 47.0105,
                lng: 28.8638,
                title: "Chișinău (Start)",
                desc: "Pornești spre sud — recomandat 2 zile pentru ritm relax.",
                img: "Moldova_Orheiul_Vechi.jpg",
            },
            {
                lat: 46.53,
                lng: 28.78,
                title: "Cimișlia (Pauză)",
                desc: "Pauză scurtă pentru cafea și regrupare înainte de continuare.",
                img: "Codrii_dolna.jpg",
            },
            {
                lat: 46.3,
                lng: 28.65,
                title: "Comrat",
                desc: "Cultură locală și gastronomie — merită o oprire mai lungă.",
                img: "Codrii_01.jpg",
            },
            {
                lat: 45.9,
                lng: 28.19,
                title: "Cahul (Final)",
                desc: "Final de rută — bun pentru cazare și cină în oraș.",
                img: "Prut_River.jpg",
            },
        ],
    },
};

document.addEventListener("DOMContentLoaded", () => {
    // POI close
    const closeBtn = byId<HTMLButtonElement>("poiClose");
    closeBtn?.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();
        closePoiPanel();
    });

    // Map
    const map = L.map("routesMap", { zoomControl: false }).setView([47.2, 28.5], 8);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
    }).addTo(map);

    let currentLayer: any = null;
    let currentMarkers: any[] = [];

    const clearMapSelection = (): void => {
        if (currentLayer) {
            map.removeLayer(currentLayer);
            currentLayer = null;
        }
        currentMarkers.forEach((m) => map.removeLayer(m));
        currentMarkers = [];
    };

    const showRouteById = (id: string): void => {
        const route = routes[id];
        if (!route) return;

        clearMapSelection();

        currentLayer = L.polyline(route.line, {
            color: "#6affcc",
            weight: 5,
        }).addTo(map);

        route.points.forEach((poi) => {
            const marker = L.marker([poi.lat, poi.lng]).addTo(map);
            marker.on("click", () => {
                map.setView([poi.lat, poi.lng], Math.max(map.getZoom(), 13), { animate: true });
                openPoiPanel(poi);
            });
            marker.bindPopup(poi.title);
            currentMarkers.push(marker);
        });

        map.fitBounds(currentLayer.getBounds(), { padding: [40, 40] });
        closePoiPanel();
    };

    // Click “Vezi ruta”
    document.querySelectorAll<HTMLButtonElement>(".dest-btn").forEach((btn) => {
        btn.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            const card = btn.closest<HTMLElement>(".route-card");
            const id = card?.dataset?.route;
            if (!id) return;
            showRouteById(id);
        });
    });

    // Toggle details
    document.querySelectorAll<HTMLButtonElement>(".toggle-details").forEach((btn) => {
        btn.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            const details = btn.parentElement?.querySelector<HTMLElement>(".route-details");
            if (!details) return;
            details.classList.toggle("open");
            btn.textContent = details.classList.contains("open") ? "Ascunde detalii" : "Detalii traseu";
        });
    });

    // Filter chips
    const chips = Array.from(document.querySelectorAll<HTMLElement>("[data-route-cat]"));
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".route-card"));
    const countEl = byId<HTMLElement>("routeCount");

    const applyFilter = (cat: string): void => {
        let visible = 0;
        cards.forEach((card) => {
            const cardCat = card.getAttribute("data-cat") ?? "";
            const match = cat === "toate" || cardCat === cat;
            card.style.display = match ? "" : "none";
            if (match) visible += 1;
        });
        countEl && (countEl.textContent = String(visible));
        if (visible === 0) clearMapSelection();
    };

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            chips.forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            applyFilter(chip.getAttribute("data-route-cat") || "toate");
        });
    });

    applyFilter("toate");
});
