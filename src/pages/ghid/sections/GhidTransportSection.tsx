const transportOptions = [
  {
    title: "Transport public",
    icon: "fa-solid fa-bus-simple",
    points: [
      "Autobuze și microbuze leagă bine orașele mari și localitățile turistice.",
      "Verifică orarele din timp, mai ales pentru cursele de seară.",
      "Păstrează numerar pentru bilete în zone unde plata digitală lipsește.",
    ],
  },
  {
    title: "Taxi și aplicații",
    icon: "fa-solid fa-taxi",
    points: [
      "În Chișinău ai opțiuni rapide prin aplicații de ridesharing.",
      "Confirmă punctul de preluare în zonele aglomerate.",
      "Pentru distanțe lungi, compară prețul cu transportul interurban.",
    ],
  },
  {
    title: "Închiriere auto",
    icon: "fa-solid fa-car-side",
    points: [
      "Ideală pentru rute mixte cu sate, vinării și puncte panoramice.",
      "Rezervă din timp în sezon și verifică politica de combustibil.",
      "Condu preventiv pe drumuri locale și evită deplasările foarte târzii.",
    ],
  },
];

export function GhidTransportSection() {
  return (
    <section className="section" id="ghid-transport">
      <div className="container">
        <div className="section-head">
          <h2>Transport în Moldova</h2>
          <p>Alege varianta potrivită stilului tău de călătorie.</p>
        </div>

        <div className="grid cards">
          {transportOptions.map((option) => (
            <article className="card" key={option.title}>
              <div className="card-body">
                <h3>
                  <i className={option.icon} aria-hidden="true"></i> {option.title}
                </h3>
                <ul className="guide-list">
                  {option.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
