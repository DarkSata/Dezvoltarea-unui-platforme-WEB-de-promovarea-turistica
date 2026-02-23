export function GhidPlanningSection() {
  const steps = [
    {
      title: "Definește obiectivul călătoriei",
      text: "Alege focusul principal: natură, vinării, orașe sau experiențe culturale.",
      icon: "fa-solid fa-bullseye",
    },
    {
      title: "Grupează opririle pe zone",
      text: "Combină obiective apropiate pentru a reduce timpul petrecut pe drum.",
      icon: "fa-solid fa-map",
    },
    {
      title: "Stabilește ore realiste",
      text: "Păstrează timp pentru mese, fotografii și pauze între atracții.",
      icon: "fa-solid fa-clock",
    },
    {
      title: "Păstrează un plan B",
      text: "Pregătește o alternativă pentru vreme nefavorabilă sau program schimbat.",
      icon: "fa-solid fa-shuffle",
    },
  ];

  return (
    <section className="section alt" id="ghid-planificare">
      <div className="container">
        <div className="section-head">
          <h2>Cum îți planifici călătoria</h2>
          <p>Un flux simplu, în pași clari, pentru itinerarii eficiente și relaxate.</p>
        </div>

        <div className="guide-steps">
          {steps.map((step, index) => (
            <article key={step.title} className="guide-step-item">
              <span className="guide-step-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="guide-step-card">
                <span className="pill">
                  <i className={step.icon} aria-hidden="true"></i> Pasul {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="cta guide-cta-example">
          <div className="cta-text">
            <h3>Exemplu rapid pe 3 zile</h3>
            <p>Chișinău → Orheiul Vechi → Cricova sau Mileștii Mici.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
