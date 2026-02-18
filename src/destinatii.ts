/* eslint-disable @typescript-eslint/no-explicit-any */
/* File: src/destinatii.ts */
declare const L: any;

type PlaceCat = "Natura" | "Vin" | "Manastiri" | "Istorie" | "Orase";

type Place = {
    id: string;
    name: string;
    cat: PlaceCat;
    area: string;
    lat: number;
    lng: number;
    desc: string;
    tips: string;
};

function byId<T extends HTMLElement>(id: string): T | null {
    const el = document.getElementById(id);
    return el instanceof HTMLElement ? (el as T) : null;
}

const PLACES: Place[] = [
    {
        id: "orheiul-vechi",
        name: "Orheiul Vechi",
        cat: "Istorie",
        area: "Orhei",
        lat: 47.3,
        lng: 28.971,
        desc: "Complex cultural-natural (peisaje, trasee ușoare, mănăstire rupestră).",
        tips: "Cel mai fain la apus. Ia încălțăminte comodă.",
    },
    {
        id: "cricova",
        name: "Cricova",
        cat: "Vin",
        area: "Chișinău",
        lat: 47.1407,
        lng: 28.8637,
        desc: 'Galerii subterane și degustări într-un „oraș” al vinului.',
        tips: "Rezervă turul din timp; e răcoare în galerii.",
    },
    {
        id: "tipova",
        name: "Țipova (mănăstirea rupestră)",
        cat: "Manastiri",
        area: "Rezina",
        lat: 47.6146,
        lng: 28.9832,
        desc: "Complex rupestru pe Nistru + trasee și panorame.",
        tips: "Trasee pe stâncă: atenție la vreme.",
    },
    {
        id: "soroca",
        name: "Cetatea Soroca",
        cat: "Istorie",
        area: "Soroca",
        lat: 48.1582,
        lng: 28.2962,
        desc: "Fortăreață medievală rotundă, super fotogenică.",
        tips: 'Combină cu „Lumânarea Recunoștinței” și Nistrul.',
    },
    {
        id: "codrii",
        name: 'Rezervația „Codrii”',
        cat: "Natura",
        area: "Strășeni",
        lat: 47.1008,
        lng: 28.422,
        desc: "Păduri, aer curat și trasee scurte aproape de Chișinău.",
        tips: "Perfectă pentru o plimbare de weekend.",
    },
    {
        id: "mimi",
        name: "Castel Mimi",
        cat: "Vin",
        area: "Anenii Noi",
        lat: 46.9987,
        lng: 29.0586,
        desc: "Vinărie cu arhitectură spectaculoasă, gastronomie și evenimente.",
        tips: "Merită tur + prânz; rezervare recomandată.",
    },
    // ... (дальше можешь перенести весь массив как у тебя — TS это спокойно выдержит)
];

const icons: Record<PlaceCat, string> = {
    Natura: "fa-mountain-sun",
    Vin: "fa-wine-glass",
    Manastiri: "fa-landmark-dome",
    Istorie: "fa-landmark",
    Orase: "fa-city",
};

const emoji: Record<PlaceCat, string> = {
    Natura: "⛰️",
    Vin: "🍷",
    Manastiri: "⛪",
    Istorie: "🏰",
    Orase: "🏙️",
};

function photoUrl(place: Place): string {
    const q = encodeURIComponent(`${place.name} Moldova`);
    return `https://source.unsplash.com/1200x800/?${q}`;
}
function photoUrlLarge(place: Place): string {
    const q = encodeURIComponent(`${place.name} Moldova`);
    return `https://source.unsplash.com/2200x1400/?${q}`;
}

function svgCardArt(place: Place): string {
    const e = emoji[place.cat] || "📍";
    const title = (place.name || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const subtitle = `${place.cat} • ${place.area}`
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(120,170,255,.45)"/>
        <stop offset="1" stop-color="rgba(106,255,204,.25)"/>
      </linearGradient>
      <radialGradient id="r" cx="20%" cy="20%" r="80%">
        <stop offset="0" stop-color="rgba(255,255,255,.18)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="rgba(0,0,0,.35)"/>
      </filter>
    </defs>
    <rect width="1200" height="600" fill="rgba(255,255,255,.02)"/>
    <rect x="0" y="0" width="1200" height="600" fill="url(#g)"/>
    <circle cx="250" cy="170" r="220" fill="url(#r)"/>
    <circle cx="980" cy="80" r="260" fill="url(#r)"/>
    <g filter="url(#s)">
      <rect x="56" y="330" width="1088" height="210" rx="34" fill="rgba(11,18,32,.55)" stroke="rgba(234,240,255,.18)" />
      <text x="96" y="408" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="54" fill="rgba(234,240,255,.98)">${e} ${title}</text>
      <text x="96" y="470" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="30" fill="rgba(234,240,255,.78)">${subtitle}</text>
    </g>
  </svg>
  `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function markerHtml(cat: PlaceCat): string {
    const cls = icons[cat] || "fa-location-dot";
    return `<div class="marker"><i class="fa-solid ${cls}" aria-hidden="true"></i></div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsEl = byId<HTMLElement>("cards");
    const countEl = byId<HTMLElement>("count");
    const searchEl = byId<HTMLInputElement>("search");
    const chips = Array.from(document.querySelectorAll<HTMLButtonElement>(".chip"));

    const lightbox = byId<HTMLElement>("lightbox");
    const lightboxImg = byId<HTMLImageElement>("lightboxImg");
    const lightboxCaption = byId<HTMLElement>("lightboxCaption");

    const openLightbox = (place: Place): void => {
        if (!lightbox || !lightboxImg || !lightboxCaption) return;

        lightboxImg.src = photoUrlLarge(place);
        lightboxImg.onerror = () => {
            lightboxImg.src = svgCardArt(place);
        };

        lightboxCaption.textContent = `${place.name} — ${place.cat} • ${place.area}`;
        lightbox.setAttribute("aria-hidden", "false");
        lightbox.classList.add("open");
        document.body.classList.add("no-scroll");
    };

    const closeLightbox = (): void => {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
        lightboxImg.src = "";
        lightboxImg.onerror = null;
    };

    lightbox?.addEventListener("click", (e: MouseEvent) => {
        const t = e.target;
        if (t instanceof HTMLElement && t.getAttribute("data-close") === "1") closeLightbox();
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
    });

    const map = L.map("map", { scrollWheelZoom: true }).setView([47.2, 28.6], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    map.on("click", () => map.scrollWheelZoom.enable());

    const markers = new Map<string, any>();

    const placePopup = (p: Place): string => {
        const tags = `<span class="pill">${p.cat}</span><span class="pill">${p.area}</span>`;
        return `
      <div class="popup">
        <strong>${p.name}</strong>
        <div class="popup-tags">${tags}</div>
        <p class="popup-desc">${p.desc}</p>
        <p class="popup-tips"><i class="fa-regular fa-lightbulb"></i> ${p.tips}</p>
      </div>
    `;
    };

    const ensureMarker = (p: Place): any => {
        if (markers.has(p.id)) return markers.get(p.id);

        const m = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
                className: "dest-icon",
                html: markerHtml(p.cat),
                iconSize: [30, 30],
                iconAnchor: [15, 28],
            }),
        }).addTo(map);

        m.bindPopup(placePopup(p));
        markers.set(p.id, m);
        return m;
    };

    let activeCat: "toate" | PlaceCat = "toate";

    const matches = (p: Place, q: string): boolean => {
        if (!q) return true;
        const hay = `${p.name} ${p.area} ${p.cat} ${p.desc} ${p.tips}`.toLowerCase();
        return hay.includes(q.toLowerCase());
    };

    const filteredPlaces = (): Place[] => {
        const q = (searchEl?.value || "").trim();
        return PLACES.filter((p) => (activeCat === "toate" || p.cat === activeCat) && matches(p, q));
    };

    const render = (): void => {
        if (!cardsEl || !countEl) return;

        const list = filteredPlaces();
        countEl.textContent = String(list.length);

        markers.forEach((m) => map.removeLayer(m));
        markers.clear();
        list.forEach(ensureMarker);

        cardsEl.innerHTML = "";
        for (const p of list) {
            const fallback = svgCardArt(p);

            const el = document.createElement("article");
            el.className = "card destination-card";
            el.id = p.id;

            el.innerHTML = `
        <div class="card-media" data-id="${p.id}">
          <img class="media-preload" src="${photoUrl(p)}" alt="" aria-hidden="true">
          <div class="card-media-overlay"></div>
          <div class="card-media-top">
            <div class="mini-header">
              <div class="mini-title">
                <span class="mini-emoji">${emoji[p.cat] || "📍"}</span>
                <span class="mini-name">${p.name}</span>
              </div>
              <div class="mini-meta">${p.cat} • ${p.area}</div>
            </div>
            <div class="zoom-badge" aria-hidden="true">
              <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
            </div>
          </div>
        </div>

        <div class="card-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>

          <div class="dest-row">
            <span class="pill">${p.cat}</span>
            <span class="pill">${p.area}</span>
          </div>

          <div class="dest-row bottom">
            <span class="muted tip"><i class="fa-regular fa-lightbulb"></i> ${p.tips}</span>
          </div>

          <button class="btn small dest-btn" type="button" data-id="${p.id}">
            Vezi pe hartă <i class="fa-solid fa-location-dot"></i>
          </button>
        </div>
      `;

            const preload = el.querySelector<HTMLImageElement>(".media-preload");
            const media = el.querySelector<HTMLElement>(".card-media");
            if (preload && media) {
                preload.onload = () => {
                    media.style.backgroundImage = `url(${preload.src})`;
                    media.style.backgroundSize = "cover";
                    media.style.backgroundPosition = "center";
                };
                preload.onerror = () => {
                    media.style.backgroundImage = `url(${fallback})`;
                    media.style.backgroundSize = "cover";
                    media.style.backgroundPosition = "center";
                };
            }

            cardsEl.appendChild(el);
        }
    };

    chips.forEach((ch) => {
        ch.addEventListener("click", () => {
            chips.forEach((x) => x.classList.remove("active"));
            ch.classList.add("active");
            const cat = ch.dataset.cat;
            activeCat = cat === "toate" ? "toate" : (cat as PlaceCat);
            render();
        });
    });

    searchEl?.addEventListener("input", render);

    cardsEl?.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const media = target.closest(".card-media") as HTMLElement | null;
        if (media) {
            const card = target.closest(".destination-card") as HTMLElement | null;
            const id = card?.id;
            const p = PLACES.find((x) => x.id === id);
            if (p) openLightbox(p);
            return;
        }

        const btn = target.closest(".dest-btn") as HTMLButtonElement | null;
        if (!btn) return;

        const id = btn.dataset.id;
        const p = PLACES.find((x) => x.id === id);
        if (!p) return;

        const m = ensureMarker(p);
        map.flyTo([p.lat, p.lng], 12, { duration: 0.8 });
        setTimeout(() => m.openPopup(), 450);
    });

    render();
});

