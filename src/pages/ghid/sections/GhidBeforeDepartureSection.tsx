const preDepartureChecklist = [
  {
    title: "Alege perioada potrivită",
    description: "Primăvara și toamna oferă temperaturi plăcute, peisaje bune și trafic mai relaxat.",
  },
  {
    title: "Setează ritmul",
    description: "Planifică 1–2 atracții principale pe zi ca să ai timp și pentru pauze.",
  },
  {
    title: "Rezervă din timp",
    description: "Weekendurile se ocupă rapid la pensiuni, vinării și restaurante populare.",
  },
  {
    title: "Lasă loc de spontan",
    description: "Păstrează o fereastră liberă pentru opriri neplanificate și recomandări locale.",
  },
  {
    title: "Ce să iei cu tine",
    description: "Încălțăminte comodă, apă, protecție solară și power bank pentru zile lungi.",
  },
  {
    title: "Documente și bani",
    description: "Ține actele la tine și păstrează numerar pentru zone unde plata cu cardul e limitată.",
  },
  {
    title: "Siguranță și respect",
    description: "Respectă natura, regulile locale și semnalizarea din rezervații sau zone protejate.",
  },
  {
    title: "Internet și conectivitate",
    description: "Verifică acoperirea mobilă și opțiunile de roaming sau SIM local pentru date.",
  },
];

export function GhidBeforeDepartureSection() {
  return (
    <section className="section" id="ghid-plecare">
      <div className="container">
        <div className="section-head">
          <h2>Ghid înainte de plecare</h2>
          <p>Checklist extins, clar și ușor de parcurs înainte de drum.</p>
        </div>

        <div className="grid check-grid">
          {preDepartureChecklist.map((item, index) => (
            <article className="check-item" key={item.title}>
              <span className="check-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
