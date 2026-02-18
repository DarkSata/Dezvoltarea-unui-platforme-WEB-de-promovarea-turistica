import { useEffect, useMemo, useState } from "react";
import DestinationsMap from "../components/DestinationsMap";
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
  Natura: "Natură",
  Vin: "Vinării",
  Manastiri: "Mănăstiri",
  Istorie: "Istorie",
  Orase: "Orașe",
};

const FALLBACK_IMAGE = "/images/logo-moldova.png";

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

export default function DestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"Toate" | DestinationCategory>("Toate");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightboxDestination, setLightboxDestination] = useState<Destination | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await destinationsService.list();
        if (!active) return;
        setItems(data);
        setSelectedId(data[0]?.id ?? null);
      } catch {
        if (!active) return;
        setError("Nu am putut încărca destinațiile.");
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
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const byCategory = category === "Toate" || item.cat === category;
      const bySearch =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.area.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.tips.toLowerCase().includes(term);

      return byCategory && bySearch;
    });
  }, [category, items, search]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filtered.some((item) => item.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  useEffect(() => {
    if (!lightboxDestination) return;

    document.body.classList.add("no-scroll");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxDestination(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [lightboxDestination]);

  const selected = filtered.find((item) => item.id === selectedId) ?? null;

  function focusOnDestination(destinationId: string, scrollToMap = false) {
    setSelectedId(destinationId);

    if (!scrollToMap) return;
    if (!window.matchMedia("(max-width: 980px)").matches) return;

    const mapWrap = document.querySelector(".destinations-map-wrap");
    if (mapWrap instanceof HTMLElement) {
      mapWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeLightbox() {
    setLightboxDestination(null);
  }

  return (
    <div className="destinatii-page">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Destinații</h2>
            <p>Caută, filtrează și explorează direct pe hartă toate locurile turistice.</p>
          </div>

          <div className="destinations-toolbar">
            <label className="search" aria-label="Caută destinații">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Caută (ex: Orhei, vinărie, Nistru...)"
              />
            </label>

            <div className="chips" role="tablist" aria-label="Categorii">
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

          {loading ? <Loading text="Se încarcă destinațiile..." /> : null}
          {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
          {!loading && !error && filtered.length === 0 ? (
            <Empty title="Nu am găsit rezultate" description="Schimbă filtrul sau căutarea." />
          ) : null}

          {!loading && !error && filtered.length > 0 ? (
            <div className="destinations-layout">
              <DestinationsMap
                places={filtered}
                selected={selected}
                onSelect={(destination) => focusOnDestination(destination.id)}
                fallbackImage={FALLBACK_IMAGE}
              />

              <aside className="destinations-list" aria-label="Lista destinațiilor">
                <div className="destinations-meta">
                  <strong>{filtered.length}</strong>
                  <span className="muted">locuri afișate</span>
                </div>

                <div className="grid destinations-cards">
                  {filtered.map((item) => {
                    const imageSrc = item.image?.trim() ? item.image : FALLBACK_IMAGE;

                    return (
                      <article
                        key={item.id}
                        className={`card destination-card selectable-card ${selectedId === item.id ? "active" : ""}`}
                        onClick={() => focusOnDestination(item.id)}
                      >
                        <button
                          className="card-media"
                          type="button"
                          style={{ backgroundImage: `url('${imageSrc}')` }}
                          aria-label={`Mărește imaginea pentru ${item.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setLightboxDestination(item);
                          }}
                        >
                          <img
                            className="media-preload"
                            src={imageSrc}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src = FALLBACK_IMAGE;
                              event.currentTarget.parentElement?.setAttribute(
                                "style",
                                `background-image: url('${FALLBACK_IMAGE}')`,
                              );
                            }}
                          />
                          <div className="card-media-overlay"></div>
                          <div className="card-media-top">
                            <div className="mini-header">
                              <div className="mini-title">
                                <i className={categoryIcon(item.cat)} aria-hidden="true"></i>
                                <span>{item.name}</span>
                              </div>
                              <div className="mini-meta">
                                {item.area} | {CATEGORY_LABEL[item.cat]}
                              </div>
                            </div>
                            <span className="zoom-badge" aria-hidden="true">
                              <i className="fa-solid fa-magnifying-glass-plus"></i>
                            </span>
                          </div>
                        </button>

                        <div className="card-body">
                          <p>{item.description}</p>
                          <div className="dest-row">
                            <span className="pill">
                              <i className="fa-solid fa-layer-group" aria-hidden="true"></i> {CATEGORY_LABEL[item.cat]}
                            </span>
                            <span className="pill">
                              <i className="fa-solid fa-location-dot" aria-hidden="true"></i> {item.area}
                            </span>
                          </div>
                          <div className="dest-row bottom">
                            <span className="pill tip">
                              <i className="fa-regular fa-lightbulb" aria-hidden="true"></i> {item.tips}
                            </span>
                          </div>
                          <button
                            className="btn small dest-btn"
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              focusOnDestination(item.id, true);
                            }}
                          >
                            Vezi pe hartă
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </section>

      <div className={`lightbox ${lightboxDestination ? "open" : ""}`} aria-hidden={!lightboxDestination}>
        <div className="lightbox-backdrop" data-close="1" onClick={closeLightbox}></div>
        <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label="Imagine destinație">
          <button className="lightbox-close" type="button" aria-label="Închide" onClick={closeLightbox}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img
            className="lightbox-img"
            src={lightboxDestination?.image?.trim() ? lightboxDestination.image : FALLBACK_IMAGE}
            alt={lightboxDestination ? `Imagine ${lightboxDestination.name}` : "Imagine destinație"}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="lightbox-caption">
            {lightboxDestination ? `${lightboxDestination.name} | ${lightboxDestination.area}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
