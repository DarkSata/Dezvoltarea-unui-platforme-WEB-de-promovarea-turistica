import { Link } from "react-router-dom";

export default function ServerError500() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">500</p>
          <h2>Eroare internă de server</h2>
          <p className="muted">Eroare simulată de serviciu. Încearcă din nou sau revino mai târziu.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/">
              Înapoi acasă
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
