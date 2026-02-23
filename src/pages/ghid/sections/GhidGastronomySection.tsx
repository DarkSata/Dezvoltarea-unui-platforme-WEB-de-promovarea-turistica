const dishes = [
  {
    name: "Plăcinte",
    description: "Foi crocante cu umpluturi sărate sau dulci, perfecte pentru drum.",
  },
  {
    name: "Sarmale",
    description: "Rulate tradiționale servite cald, adesea în meniuri locale de weekend.",
  },
  {
    name: "Mămăligă",
    description: "Preparat clasic, servit cu brânză, smântână și tocănițe locale.",
  },
  {
    name: "Zeamă",
    description: "Supă reconfortantă cu pui și tăiței de casă, foarte populară în pensiuni.",
  },
  {
    name: "Vin local",
    description: "Degustări de soiuri locale și cupaje premiate în crame din toată țara.",
  },
];

export function GhidGastronomySection() {
  return (
    <section className="section" id="ghid-gastronomie">
      <div className="container">
        <div className="section-head">
          <h2>Gastronomie</h2>
          <p>Arome locale care completează experiența turistică.</p>
        </div>

        <div className="grid cards">
          {dishes.map((dish) => (
            <article className="card" key={dish.name}>
              <div className="card-body">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
