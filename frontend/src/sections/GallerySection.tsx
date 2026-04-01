import { useEffect, useState } from "react";
import ErrorState from "../components/Error";
import Loading from "../components/Loading";
import { galleryService, type GalleryBlock } from "../services/galleryService";

export function GallerySection() {
  const [items, setItems] = useState<GalleryBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const data = await galleryService.list();
        if (!mounted) return;
        setItems(data);
      } catch {
        if (!mounted) return;
        setError("Nu am putut incarca galeria.");
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
    <section className="section alt" id="galerie">
      <div className="container">
        <div className="section-head">
          <h2>Galerie de atmosfera</h2>
          <p>Cadre tematice care completeaza experienta turistica din Moldova.</p>
        </div>

        {loading ? <Loading text="Se incarca galeria..." /> : null}
        {!loading && error ? <ErrorState title="Eroare" message={error} /> : null}
        {!loading && !error ? (
          <div className="grid gallery-grid">
            {items.map((item) => (
              <figure className={`gallery-item ${item.theme}`} key={item.id}>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
