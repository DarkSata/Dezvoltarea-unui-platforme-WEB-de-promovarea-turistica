export function DestinatiiHero() {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="hero-kicker">Harta | Filtre | Info rapid</p>
        <h1>Destinatii in Moldova</h1>
        <p className="hero-subtitle">
          Exploreaza locuri turistice (natura, vinarii, manastiri, istorie si orase). Apasa pe un loc din lista ca sa-l vezi pe harta.
        </p>

        <div className="hero-actions">
          <a className="btn primary" href="#/destinatii/harta">Deschide harta</a>
          <a className="btn ghost" href="#/">Inapoi la pagina principala</a>
        </div>

        <div className="note">
          Nota: nu exista o lista oficiala cu toate atractiile. Aici ai o colectie mare de repere populare din Moldova, cu coordonate aproximative pentru planificare rapida.
        </div>
      </div>
    </section>
  )
}
