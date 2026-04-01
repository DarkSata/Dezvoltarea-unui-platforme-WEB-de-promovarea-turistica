const tips = [
  "Păstrează numerar pentru zonele rurale.",
  "Verifică programul obiectivelor înainte de plecare.",
  "Ia încărcător și power bank pentru drumuri lungi.",
  "Poartă încălțăminte comodă pe trasee denivelate.",
  "Ia apă și gustări pentru deplasări între localități.",
  "Salvează offline harta în caz de semnal slab.",
  "Confirmă rezervările cu 24 de ore înainte.",
  "Păstrează o geacă ușoară pentru serile răcoroase.",
  "Folosește protecție solară în zilele lungi de vară.",
  "Respectă liniștea și regulile în spații religioase.",
];

export function GhidTipsSection() {
  return (
    <section className="section alt" id="ghid-sfaturi">
      <div className="container">
        <div className="section-head">
          <h2>Sfaturi utile</h2>
          <p>Checklist rapid, ușor de scanat înainte de fiecare zi de călătorie.</p>
        </div>

        <div className="grid check-grid">
          {tips.map((tip, index) => (
            <article className="check-item" key={tip}>
              <span className="check-index">{String(index + 1).padStart(2, "0")}</span>
              <p>{tip}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
