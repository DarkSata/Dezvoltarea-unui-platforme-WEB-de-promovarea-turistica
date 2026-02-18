import { Link } from "react-router-dom";

export default function Forbidden403() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">403</p>
          <h2>Acces interzis</h2>
          <p className="muted">Ai sesiune activă, dar nu ai permisiunea necesară pentru această zonă.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/">
              Înapoi acasă
            </Link>
            <Link className="btn ghost" to="/destinations">
              Vezi destinații
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
