import { Link } from "react-router-dom";

const categories = [
  {
    title: "Natură",
    text: "Rezervații, păduri și belvederi pentru ritm relaxat și aer curat.",
    icon: "fa-solid fa-tree",
  },
  {
    title: "Vinării",
    text: "Crame mari și boutique, tururi ghidate și degustări tematice.",
    icon: "fa-solid fa-wine-glass",
  },
  {
    title: "Cultură",
    text: "Mănăstiri, cetăți, sate istorice și obiective cu patrimoniu local.",
    icon: "fa-solid fa-landmark",
  },
  {
    title: "Orașe",
    text: "Chișinău și alte orașe cu gastronomie, evenimente și plimbări urbane.",
    icon: "fa-solid fa-city",
  },
];

export function GhidWhatToVisitSection() {
  return (
    <section className="section alt" id="ghid-vizite">
      <div className="container">
        <div className="section-head">
          <h2>Ce merită să vizitezi</h2>
          <p>Patru direcții clare, în funcție de preferințele tale.</p>
        </div>

        <div className="grid perks">
          {categories.map((category) => (
            <article className="perk" key={category.title}>
              <i className={category.icon} aria-hidden="true"></i>
              <h3>{category.title}</h3>
              <p>{category.text}</p>
              <Link className="btn small" to="/destinations">
                Vezi destinațiile
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
