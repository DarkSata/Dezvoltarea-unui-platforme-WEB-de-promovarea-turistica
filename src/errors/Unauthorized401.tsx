import { Link } from "react-router-dom";

export default function Unauthorized401() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">401</p>
          <h2>Neautorizat</h2>
          <p className="muted">Trebuie să fii autentificat ca să accesezi această pagină.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/login">
              Mergi la login
            </Link>
            <Link className="btn ghost" to="/">
              Înapoi acasă
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
