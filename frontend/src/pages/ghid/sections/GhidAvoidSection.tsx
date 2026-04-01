const avoidList = [
  "Nu supraîncărca ziua cu prea multe opriri.",
  "Nu porni la drum lung fără apă și gustări.",
  "Nu ignora prognoza meteo înainte de trasee outdoor.",
  "Nu lăsa rezervările pe ultima clipă în weekend.",
  "Nu intra cu mașina pe drumuri necunoscute fără verificare.",
  "Nu fotografia în zone unde există restricții explicite.",
];

export function GhidAvoidSection() {
  return (
    <section className="section" id="ghid-evita">
      <div className="container">
        <div className="section-head">
          <h2>Ce să eviți</h2>
          <p>Recomandări prietenoase ca să păstrezi experiența plăcută și fără stres.</p>
        </div>

        <article className="card">
          <div className="card-body">
            <ul className="guide-list">
              {avoidList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
