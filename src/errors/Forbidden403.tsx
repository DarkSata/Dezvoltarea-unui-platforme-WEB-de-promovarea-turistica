import { Link } from "react-router-dom";

export default function Forbidden403() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">403</p>
          <h2>Forbidden</h2>
          <p className="muted">Ai sesiune activa, dar nu ai permisiunea necesara pentru aceasta zona.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/">
              Inapoi acasa
            </Link>
            <Link className="btn ghost" to="/destinations">
              Vezi destinatii
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
