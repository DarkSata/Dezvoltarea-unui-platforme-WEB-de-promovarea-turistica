import { Link } from "react-router-dom";

export function GhidFinalCtaSection() {
  return (
    <section className="section" id="ghid-final">
      <div className="container">
        <article className="cta guide-final-cta">
          <div className="cta-text">
            <h3>Ai nevoie de ajutor?</h3>
            <p>Scrie-ne ce tip de experiență cauți și îți sugerăm un plan potrivit.</p>
          </div>

          <div className="guide-final-actions">
            <Link className="btn primary" to="/contact">
              Mergi la contact
            </Link>
            <Link className="btn ghost" to="/routes">
              Vezi toate rutele
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
