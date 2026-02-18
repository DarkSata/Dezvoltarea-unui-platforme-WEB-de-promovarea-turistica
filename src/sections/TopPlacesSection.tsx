import { useEffect, useState } from 'react'
import { topPlaces } from '../data/home/topPlaces'

const SLIDE_INTERVAL_MS = 15000
const COLLAGE_TILE_COUNT = 4

function pickCollageImage(images: string[], slideIndex: number, offset: number) {
  if (images.length === 0) {
    return ''
  }

  return images[(slideIndex + offset) % images.length]
}

export function TopPlacesSection() {
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSlideIndex((current) => current + 1)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timerId)
  }, [])

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
              <div className={`card-media media-${place.id} top-place-media`} role="img" aria-label={`Colaj foto ${place.name}`}>
                <div className="card-collage" aria-hidden="true">
                  {Array.from({ length: COLLAGE_TILE_COUNT }, (_, offset) => {
                    const image = pickCollageImage(place.collageImages, slideIndex, offset)

                    return (
                      <div
                        key={`${place.id}-${offset}`}
                        className={`card-collage-item tile-${offset + 1}`}
                        style={image ? { backgroundImage: `url('${image}')` } : undefined}
                      ></div>
                    )
                  })}
                </div>
                <div className="card-media-overlay-gradient"></div>
                <strong className="card-media-title">{place.name}</strong>
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
