export function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <p className="hero-kicker">Natură | Vinării | Mănăstiri | Istorie</p>
        <h1>Descoperă Moldova, pas cu pas</h1>
        <p className="hero-subtitle">Idei de trasee, locuri faine și recomandări rapide pentru călătorii prin Moldova.</p>

        <div className="hero-actions">
          <a className="btn primary" href="#/top-locuri">Vezi top locuri</a>
          <a className="btn ghost" href="#/rute-rapide">Trasee 1-3 zile</a>
        </div>

        <div className="hero-badges" aria-label="Repere rapide">
          <div className="badge"><i className="fa-solid fa-mountain-sun" aria-hidden="true"></i><span>Peisaje</span></div>
          <div className="badge"><i className="fa-solid fa-wine-glass" aria-hidden="true"></i><span>Vinării</span></div>
          <div className="badge"><i className="fa-solid fa-landmark" aria-hidden="true"></i><span>Cultură</span></div>
          <div className="badge"><i className="fa-solid fa-person-hiking" aria-hidden="true"></i><span>Drumeții</span></div>
        </div>
      </div>
    </section>
  )
}
