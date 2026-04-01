export function DestinatiiHero() {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="hero-kicker">Harta | Filtre | Info rapid</p>
        <h1>Destinații în Moldova</h1>
        <p className="hero-subtitle">
          Explorează locuri turistice (natură, vinării, mănăstiri, istorie și orașe). Apasă pe un loc din listă ca să-l vezi pe hartă.
        </p>

        <div className="hero-actions">
          <a className="btn primary" href="#/destinatii/harta">Deschide harta</a>
          <a className="btn ghost" href="#/">Înapoi la pagina principală</a>
        </div>

        <div className="note">
          Notă: nu există o listă oficială cu toate atracțiile. Aici ai o colecție mare de repere populare din Moldova, cu coordonate aproximative pentru planificare rapidă.
        </div>
      </div>
    </section>
  )
}
