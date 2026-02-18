import { Link } from "react-router-dom";

export default function NotFound404() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">404</p>
          <h2>Pagină inexistentă</h2>
          <p className="muted">Ruta cerută nu există în această aplicație.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/">
              Înapoi acasă
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
