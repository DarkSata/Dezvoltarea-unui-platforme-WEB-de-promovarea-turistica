import { Link } from "react-router-dom";

export function GhidHeroSection() {
  return (
    <section className="page-hero guide-page-hero" id="ghid-top">
      <div className="container">
        <div className="guide-hero-layout">
          <div className="guide-hero-main">
            <p className="hero-kicker">Planificare | Transport | Gastronomie</p>
            <h1>Ghid turistic pentru Moldova</h1>
            <p>
              Tot ce trebuie să știi pentru a-ți planifica perfect călătoria.
            </p>

            <div className="hero-actions">
              <Link className="btn primary" to="/destinations">
                Vezi destinațiile
              </Link>
              <Link className="btn ghost" to="/routes">
                Planifică o rută
              </Link>
            </div>
          </div>

          <article className="guide-hero-aside">
            <h3>Start rapid</h3>
            <ul className="guide-list">
              <li>Alege 1 zonă principală pentru fiecare zi.</li>
              <li>Lasă 20–30% din program pentru opriri spontane.</li>
              <li>Rezervă din timp cazările de weekend.</li>
              <li>Verifică transportul și prognoza înainte de plecare.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
