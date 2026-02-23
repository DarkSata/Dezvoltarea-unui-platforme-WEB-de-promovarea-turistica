const guideAnchors = [
  { id: "ghid-plecare", label: "Înainte de plecare" },
  { id: "ghid-planificare", label: "Planificare" },
  { id: "ghid-transport", label: "Transport" },
  { id: "ghid-vizite", label: "Ce vizitezi" },
  { id: "ghid-gastronomie", label: "Gastronomie" },
  { id: "ghid-sfaturi", label: "Sfaturi utile" },
  { id: "ghid-evita", label: "Ce să eviți" },
  { id: "ghid-itinerarii", label: "Itinerarii" },
];

export function GhidQuickNavSection() {
  return (
    <section className="section guide-quick-nav-section">
      <div className="container">
        <div className="guide-quick-nav" aria-label="Navigare în pagină">
          {guideAnchors.map((anchor) => (
            <a key={anchor.id} className="pill guide-nav-pill" href={`#${anchor.id}`}>
              {anchor.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
