import { topPlaces } from '../data/home/topPlaces'

export function TopPlacesSection() {
  return (
    <section className="section" id="top-locuri">
      <div className="container">
        <div className="section-head">
          <h2>Top locuri de vizitat</h2>
          <p>Alege din cele mai populare destinatii pentru o prima experienta in Moldova.</p>
        </div>

        <div className="grid cards">
          {topPlaces.map((place) => (
            <article className="card" key={place.id}>
              <div className={`card-media media-${place.id}`} data-fallback={place.name} role="img" aria-label={place.name}>
                <span>{place.vibe}</span>
              </div>
              <div className="card-body">
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <a className="card-link" href="#/top-locuri">
                  Detalii <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
