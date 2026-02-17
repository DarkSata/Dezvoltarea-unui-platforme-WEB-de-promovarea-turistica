import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import Empty from "../components/Empty";
import ErrorState from "../components/Error";
import Loading from "../components/Loading";
import { destinationsService } from "../services/destinationsService";
import type { Destination, DestinationCategory } from "../types/destination";

const CATEGORIES: Array<"Toate" | DestinationCategory> = [
  "Toate",
  "Natura",
  "Vin",
  "Manastiri",
  "Istorie",
  "Orase",
];

const CATEGORY_LABEL: Record<"Toate" | DestinationCategory, string> = {
  Toate: "Toate",
  Natura: "Natura",
  Vin: "Vinarii",
  Manastiri: "Manastiri",
  Istorie: "Istorie",
  Orase: "Orase",
};

function categoryIcon(category: DestinationCategory): string {
  switch (category) {
    case "Natura":
      return "fa-solid fa-mountain-sun";
    case "Vin":
      return "fa-solid fa-wine-glass";
    case "Manastiri":
      return "fa-solid fa-church";
    case "Istorie":
      return "fa-solid fa-landmark";
    case "Orase":
      return "fa-solid fa-city";
    default:
      return "fa-solid fa-location-dot";
  }
}

function markerIcon(category: DestinationCategory) {
  return L.divIcon({
    className: "dest-icon",
    html: `<div class="marker"><i class="${categoryIcon(category)}"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -12],
  });
}

function FlyToSelection({ destination }: { destination: Destination | null }) {
  const map = useMap();

  useEffect(() => {
    if (!destination) return;
    map.flyTo([destination.lat, destination.lng], 8, { duration: 0.6 });
  }, [destination, map]);

  return null;
}

export default function RoutesPage() {
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("focus");

  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"Toate" | DestinationCategory>("Toate");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await destinationsService.list();
        if (!active) return;

        setItems(data);
        const selected = data.find((item) => item.id === focusId);
        setSelectedId(selected ? selected.id : data[0]?.id ?? null);
      } catch {
        if (!active) return;
        setError("Nu am putut incarca harta.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [focusId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const byCategory = category === "Toate" || item.cat === category;
      const bySearch =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.area.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return byCategory && bySearch;
    });
  }, [category, items, search]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }

    const hasSelected = selectedId ? filtered.some((item) => item.id === selectedId) : false;
    if (!hasSelected) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((item) => item.id === selectedId) ?? null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Harta locurilor</h2>
          <p>Cauta, filtreaza pe categorii si planifica usor un itinerar.</p>
        </div>

        <div className="destinations-toolbar">
          <label className="search" aria-label="Search route points">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cauta (ex: Orhei, vinarie, Nistru...)"
            />
          </label>

          <div className="chips" role="tablist" aria-label="Categories">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                className={`chip ${item === category ? "active" : ""}`}
                type="button"
                onClick={() => setCategory(item)}
              >
                {CATEGORY_LABEL[item]}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loading text="Se incarca harta..." /> : null}
        {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
        {!loading && !error && filtered.length === 0 ? (
          <Empty title="Nicio destinatie" description="Schimba filtrul pentru a vedea puncte pe harta." />
        ) : null}

        {!loading && !error && filtered.length > 0 ? (
          <div className="destinations-layout">
            <div className="destinations-map-wrap">
              <MapContainer center={[47.22, 28.58]} zoom={7} className="destinations-map">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filtered.map((item) => (
                  <Marker
                    key={item.id}
                    position={[item.lat, item.lng]}
                    icon={markerIcon(item.cat)}
                    eventHandlers={{ click: () => setSelectedId(item.id) }}
                  >
                    <Popup>
                      <div className="popup">
                        <strong>{item.name}</strong>
                        <div className="popup-tags">
                          <span className="pill">{CATEGORY_LABEL[item.cat]}</span>
                          <span className="pill">{item.area}</span>
                        </div>
                        <p className="popup-desc">{item.description}</p>
                        <p className="popup-tips">{item.tips}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                <FlyToSelection destination={selected} />
              </MapContainer>

              <p className="map-hint">Selecteaza un marker sau un card din lista din dreapta.</p>
            </div>

            <aside className="destinations-list">
              <div className="destinations-meta">
                <strong>{filtered.length}</strong>
                <span className="muted">locuri afisate</span>
              </div>

              <div className="grid destinations-cards">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className={`card ${selectedId === item.id ? "selectable-card active" : "selectable-card"}`}
                    onClick={() => setSelectedId(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(item.id);
                      }
                    }}
                  >
                    <div className="card-body">
                      <h3>{item.name}</h3>
                      <div className="dest-row">
                        <span className="pill">{CATEGORY_LABEL[item.cat]}</span>
                        <span className="pill">{item.area}</span>
                      </div>
                      <p>{item.description}</p>
                      <p className="muted tip">
                        <i className="fa-regular fa-lightbulb" aria-hidden="true"></i> {item.tips}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  );
}
