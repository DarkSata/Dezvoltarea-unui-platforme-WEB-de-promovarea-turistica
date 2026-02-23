import { useEffect, useState } from "react";
import ErrorState from "../components/Error";
import Loading from "../components/Loading";
import { guideService, type GuideChecklistItem } from "../services/guideService";

export function GuideSection() {
  const [items, setItems] = useState<GuideChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const data = await guideService.list();
        if (!mounted) return;
        setItems(data);
      } catch {
        if (!mounted) return;
        setError("Nu am putut incarca checklist-ul de ghid.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section" id="ghid-rapid">
      <div className="container">
        <div className="section-head">
          <h2>Ghid rapid inainte de plecare</h2>
          <p>Un checklist compact care te ajuta sa organizezi un city-break fara stres.</p>
        </div>

        {loading ? <Loading text="Se incarca ghidul..." /> : null}
        {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
        {!loading && !error ? (
          <div className="grid check-grid">
            {items.map((item, index) => (
              <article className="check-item" key={item.id}>
                <span className="check-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
