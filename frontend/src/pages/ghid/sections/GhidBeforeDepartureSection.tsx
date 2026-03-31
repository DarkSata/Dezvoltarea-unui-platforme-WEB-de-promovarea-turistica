import { useEffect, useState } from "react";
import ErrorState from "../../../components/Error";
import Loading from "../../../components/Loading";
import { guideService, type GuideChecklistItem } from "../../../services/guideService";

const fallbackChecklist: GuideChecklistItem[] = [
  {
    id: "fallback-1",
    title: "Alege perioada potrivita",
    description: "Primavara si toamna ofera temperaturi placute si un ritm mai relaxat.",
  },
  {
    id: "fallback-2",
    title: "Seteaza ritmul",
    description: "Planifica 1-2 atractii principale pe zi, cu timp pentru pauze.",
  },
  {
    id: "fallback-3",
    title: "Rezerva din timp",
    description: "Weekendurile se ocupa rapid la pensiuni, vinarii si restaurante.",
  },
  {
    id: "fallback-4",
    title: "Lasa loc de spontan",
    description: "Pastreaza o fereastra libera pentru opriri neplanificate.",
  },
];

export function GhidBeforeDepartureSection() {
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
        setItems(data.length > 0 ? data : fallbackChecklist);
      } catch {
        if (!mounted) return;
        setError("Nu am putut incarca ghidul.");
        setItems(fallbackChecklist);
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
    <section className="section" id="ghid-plecare">
      <div className="container">
        <div className="section-head">
          <h2>Ghid inainte de plecare</h2>
          <p>Checklist extins, clar si usor de parcurs inainte de drum.</p>
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
