import { Link } from "react-router-dom";

const itineraries = [
  {
    title: "City break (2 zile)",
    summary: "Chișinău + Orheiul Vechi",
    stops: ["Centru Chișinău", "Parcuri și gastronomie", "Orheiul Vechi"],
    routeId: "auto-orhei",
  },
  {
    title: "Tur vinicol (3 zile)",
    summary: "Purcari + Et Cetera + Cricova",
    stops: ["Purcari", "Et Cetera", "Cricova"],
    routeId: "vinarii-sud-est",
  },
  {
    title: "Natură & panorame (2–3 zile)",
    summary: "Saharna + Țipova + Nistru",
    stops: ["Saharna", "Belvederi Nistru", "Țipova"],
    routeId: "saharna-tipova",
  },
  {
    title: "Mix complet (4–5 zile)",
    summary: "Chișinău + vinării + sud",
    stops: ["Chișinău", "Cricova/Mimi", "Comrat", "Cahul"],
    routeId: "auto-sud",
  },
];

export function GhidItinerariesSection() {
  return (
    <section className="section alt" id="ghid-itinerarii">
      <div className="container">
        <div className="section-head">
          <h2>Itinerarii recomandate</h2>
          <p>Alege varianta care se potrivește timpului tău disponibil.</p>
        </div>

        <div className="grid guide-itineraries-grid">
          {itineraries.map((item) => (
            <article className="route" key={item.title}>
              <h3>{item.title}</h3>
              <p className="muted">{item.summary}</p>
              <ul>
                {item.stops.map((stop) => (
                  <li key={stop}>{stop}</li>
                ))}
              </ul>
              <Link className="btn small" to={`/routes?route=${encodeURIComponent(item.routeId)}`}>
                Vezi ruta
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
