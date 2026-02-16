import { Link } from "react-router-dom";
import { MOCK_DESTINATIONS } from "../data/mockDestinations";

const ROUTE_IDEAS = [
  {
    title: "Traseu 1-3 zile",
    points: ["Chisinau", "Orheiul Vechi", "Cricova"],
  },
  {
    title: "Nord cultural",
    points: ["Balti", "Soroca", "Rezina"],
  },
  {
    title: "Vinarii si istorie",
    points: ["Castel Mimi", "Cricova", "Orhei"],
  },
];

export default function HomePage() {
  const top = MOCK_DESTINATIONS.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <p className="hero-kicker">Natura • Vinarii • Manastiri • Istorie</p>
          <h1>Descopera Moldova, pas cu pas</h1>
          <p className="hero-subtitle">
            Idei de trasee, locuri faine si recomandari rapide pentru calatorii prin Moldova.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/destinations">
              Vezi top locuri
            </Link>
            <Link className="btn ghost" to="/routes">
              Trasee 1-3 zile
            </Link>
          </div>
          <div className="hero-badges">
            <span className="badge">
              <i className="fa-solid fa-mountain-sun" aria-hidden="true"></i>
              Peisaje
            </span>
            <span className="badge">
              <i className="fa-solid fa-wine-glass" aria-hidden="true"></i>
              Vinarii
            </span>
            <span className="badge">
              <i className="fa-solid fa-landmark" aria-hidden="true"></i>
              Cultura
            </span>
            <span className="badge">
              <i className="fa-solid fa-person-hiking" aria-hidden="true"></i>
              Drumetii
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Top locuri de vizitat</h2>
            <p>Carduri rapide cu locuri populare si idei pentru weekend.</p>
          </div>

          <div className="grid cards">
            {top.map((item) => (
              <article key={item.id} className="card destination-card">
                <div className="card-media"></div>
                <div className="card-body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="dest-row bottom">
                    <span className="pill">{item.cat}</span>
                    <span className="pill">{item.area}</span>
                  </div>
                  <Link className="card-link" to={`/routes?focus=${item.id}`}>
                    Vezi pe harta <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <h2>Idei de trasee</h2>
            <p>Planuri simple care combina natura, vinarii si obiective culturale.</p>
          </div>
          <div className="grid routes">
            {ROUTE_IDEAS.map((route) => (
              <article className="route" key={route.title}>
                <h3>{route.title}</h3>
                <ul>
                  {route.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Link className="btn small" to="/routes">
                  Deschide ruta
                </Link>
              </article>
            ))}
          </div>

          <div className="cta">
            <div className="cta-text">
              <h3>Ai cont de admin?</h3>
              <p>Gestioneaza destinatiile direct din panoul de control.</p>
            </div>
            <Link className="btn primary" to="/admin">
              Mergi in Admin
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
