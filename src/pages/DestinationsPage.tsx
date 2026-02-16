import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DestinationsMap from "../components/DestinationsMap";
import { destinationsService } from "../services/destinationsService";
import type { Destination } from "../types/destination";

const CATEGORIES = [
    { key: "toate", label: "Toate" },
    { key: "Natura", label: "Natură" },
    { key: "Vin", label: "Vinării" },
    { key: "Manastiri", label: "Mănăstiri" },
    { key: "Istorie", label: "Istorie" },
    { key: "Orase", label: "Orașe" },
] as const;

type CatKey = (typeof CATEGORIES)[number]["key"];

export default function DestinationsPage() {
    const [all, setAll] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [q, setQ] = useState("");
    const [cat, setCat] = useState<CatKey>("toate");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError(null);

            const res = await destinationsService.list();
            if (!active) return;

            if (res.ok) {
                setAll(res.data);
            } else {
                setAll([]);
                setError(res.message);
            }

            setLoading(false);
        }

        void load();
        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return all.filter((p) => {
            const byCat = cat === "toate" || p.cat === cat;
            const hay = `${p.name} ${p.area} ${p.cat} ${p.desc} ${p.tips}`.toLowerCase();
            const byQ = !qq || hay.includes(qq);
            return byCat && byQ;
        });
    }, [all, cat, q]);

    const selected: Destination | null = useMemo(() => {
        if (!selectedId) return null;
        return filtered.find((x) => x.id === selectedId) || null;
    }, [filtered, selectedId]);

    function selectPlace(p: Destination) {
        setSelectedId(p.id);
    }

    return (
        <main>
            <section className="page-hero">
                <div className="container">
                    <p className="hero-kicker">Hartă • Filtre • Info rapid</p>
                    <h1>Destinații în Moldova</h1>
                    <p className="hero-subtitle">
                        Explorează locuri turistice (natură, vinării, mănăstiri, istorie și orașe).
                        Apasă pe un loc din listă ca să-l vezi pe hartă.
                    </p>

                    <div className="hero-actions">
                        <a className="btn primary" href="#harta">Deschide harta</a>
                        <Link className="btn ghost" to="/">Înapoi la pagina principală</Link>
                    </div>

                    <div className="note">
                        Notă: nu există o listă „oficială” cu <em>toate</em> atracțiile.
                        Aici ai o colecție mare de repere populare din Moldova, cu coordonate aproximative.
                    </div>
                </div>
            </section>

            <section className="section" id="harta">
                <div className="container">
                    <div className="section-head">
                        <h2>Harta locurilor</h2>
                        <p>Caută, filtrează pe categorii și planifică ușor un itinerar.</p>
                    </div>

                    <div className="destinations-toolbar" aria-label="Căutare și filtre">
                        <label className="search" aria-label="Caută destinații">
                            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                            <input
                                type="search"
                                placeholder="Caută (ex: Orhei, vinărie, Nistru…)"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                autoComplete="off"
                            />
                        </label>

                        <div className="chips" role="group" aria-label="Filtre categorie">
                            {CATEGORIES.map((c) => (
                                <button
                                    key={c.key}
                                    className={`chip ${cat === c.key ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setCat(c.key)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && (
                        <div className="note" role="status" aria-live="polite">
                            Se încarcă destinațiile...
                        </div>
                    )}

                    {error && (
                        <div className="note" role="alert">
                            Eroare la încărcare: {error}
                        </div>
                    )}

                    <div className="destinations-layout">
                        <DestinationsMap places={filtered} selected={selected} onSelect={selectPlace} />

                        <aside className="destinations-list" aria-label="Lista destinațiilor">
                            <div className="destinations-meta">
                                <strong>{filtered.length}</strong>
                                <span className="muted">locuri afișate</span>
                            </div>

                            <div className="grid cards destinations-cards">
                                {filtered.map((p) => (
                                    <article key={p.id} className="card destination-card" id={p.id}>
                                        <div className="card-media">
                                            <div className="card-media-overlay"></div>
                                            <div className="card-media-top">
                                                <div className="mini-header">
                                                    <div className="mini-title">
                                                        <span className="mini-emoji">📍</span>
                                                        <span className="mini-name">{p.name}</span>
                                                    </div>
                                                    <div className="mini-meta">
                                                        {p.cat} • {p.area}
                                                    </div>
                                                </div>
                                                <div className="zoom-badge" aria-hidden="true">
                                                    <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <h3>{p.name}</h3>
                                            <p>{p.desc}</p>

                                            <div className="dest-row">
                                                <span className="pill">{p.cat}</span>
                                                <span className="pill">{p.area}</span>
                                            </div>

                                            <div className="dest-row bottom">
                                                <span className="muted tip">
                                                    <i className="fa-regular fa-lightbulb"></i> {p.tips}
                                                </span>
                                            </div>

                                            <button
                                                className="btn small dest-btn"
                                                type="button"
                                                onClick={() => selectPlace(p)}
                                            >
                                                Vezi pe hartă <i className="fa-solid fa-location-dot"></i>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
