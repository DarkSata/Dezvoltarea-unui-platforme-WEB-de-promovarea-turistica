import { Link } from "react-router-dom";

export default function Unauthorized401() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">401</p>
          <h2>Unauthorized</h2>
          <p className="muted">Trebuie sa fii autentificat ca sa accesezi aceasta pagina.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/login">
              Mergi la login
            </Link>
            <Link className="btn ghost" to="/">
              Inapoi acasa
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
