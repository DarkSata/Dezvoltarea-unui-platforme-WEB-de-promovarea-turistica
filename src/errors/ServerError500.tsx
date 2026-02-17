import { Link } from "react-router-dom";

export default function ServerError500() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">500</p>
          <h2>Internal Server Error</h2>
          <p className="muted">Eroare simulata de serviciu. Incearca din nou sau revino mai tarziu.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/">
              Inapoi acasa
            </Link>
            <Link className="btn ghost" to="/admin">
              Admin
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
