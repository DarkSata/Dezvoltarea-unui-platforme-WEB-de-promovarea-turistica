import { Link } from "react-router-dom";

export default function NotFound404() {
  return (
    <section className="section">
      <div className="container">
        <article className="error-page">
          <p className="error-code">404</p>
          <h2>Not Found</h2>
          <p className="muted">Ruta ceruta nu exista in aceasta aplicatie.</p>
          <div className="error-actions">
            <Link className="btn primary" to="/">
              Inapoi acasa
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
