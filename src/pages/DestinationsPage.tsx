import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const CARD_GRADIENTS = [
  "linear-gradient(180deg, rgba(125,171,199,.35), rgba(12,24,44,.2))",
  "linear-gradient(180deg, rgba(89,126,160,.35), rgba(12,24,44,.2))",
  "linear-gradient(180deg, rgba(122,145,169,.35), rgba(12,24,44,.2))",
  "linear-gradient(180deg, rgba(93,129,140,.35), rgba(12,24,44,.2))",
];

export default function DestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"Toate" | DestinationCategory>("Toate");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await destinationsService.list();
        if (!active) return;
        setItems(data);
      } catch {
        if (!active) return;
        setError("Nu am putut incarca destinatiile.");
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
        item.description.toLowerCase().includes(term);

      return byCategory && bySearch;
    });
  }, [category, items, search]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Destinatii</h2>
          <p>Cauta, filtreaza si alege rapid urmatorul loc de vizitat.</p>
        </div>

        <div className="destinations-toolbar">
          <label className="search" aria-label="Search destinations">
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

        <div className="destinations-meta">
          <strong>{filtered.length}</strong>
          <span className="muted">locuri afisate</span>
        </div>

        {loading ? <Loading text="Se incarca destinatiile..." /> : null}
        {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
        {!loading && !error && filtered.length === 0 ? (
          <Empty title="Nu am gasit rezultate" description="Schimba filtrul sau cautarea." />
        ) : null}

        {!loading && !error && filtered.length > 0 ? (
          <div className="grid cards">
            {filtered.map((item, index) => (
              <article key={item.id} className="card destination-card">
                <div
                  className="card-media"
                  style={{ background: CARD_GRADIENTS[index % CARD_GRADIENTS.length] }}
                ></div>
                <div className="card-body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="dest-row bottom">
                    <span className="pill">{CATEGORY_LABEL[item.cat]}</span>
                    <span className="pill">{item.area}</span>
                  </div>
                  <Link className="btn small dest-btn" to={`/routes?focus=${item.id}`}>
                    Vezi pe harta
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
