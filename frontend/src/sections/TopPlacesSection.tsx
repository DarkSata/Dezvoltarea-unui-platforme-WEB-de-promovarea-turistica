import { memo, useEffect, useState } from 'react'
import { topPlaces } from '../data/home/topPlaces'
import type { TopPlace } from '../data/home/topPlaces'

const SLIDE_INTERVAL_MS = 15000

type SliderState = {
  activePlaceIndex: number
  imageIndexes: number[]
}

function pickCoverImage(images: string[], imageIndex: number) {
  if (images.length === 0) {
    return ''
  }

  return images[imageIndex % images.length]
}

type TopPlaceCardProps = {
  image: string
  place: TopPlace
}

const TopPlaceCard = memo(function TopPlaceCard({ image, place }: TopPlaceCardProps) {
  return (
    <article className="card">
      <div
        className={`card-media media-${place.id} top-place-media`}
        role="img"
        aria-label={`Fotografie ${place.name}`}
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      >
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
  )
})

export function TopPlacesSection() {
  const [sliderState, setSliderState] = useState<SliderState>(() => ({
    activePlaceIndex: 0,
    imageIndexes: topPlaces.map(() => 0),
  }))

  useEffect(() => {
    const uniqueImages = Array.from(new Set(topPlaces.flatMap((place) => place.collageImages)))

    uniqueImages.forEach((imagePath) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = imagePath

      if (typeof image.decode === 'function') {
        image.decode().catch(() => undefined)
      }
    })
  }, [])

  useEffect(() => {
    if (topPlaces.length === 0) {
      return undefined
    }

    const tickIntervalMs = Math.max(1000, Math.floor(SLIDE_INTERVAL_MS / topPlaces.length))
    const timerId = window.setInterval(() => {
      setSliderState((current) => {
        const pointer = current.activePlaceIndex % topPlaces.length
        const nextIndexes = [...current.imageIndexes]
        const totalImages = topPlaces[pointer]?.collageImages.length ?? 0

        if (totalImages > 0) {
          nextIndexes[pointer] = (nextIndexes[pointer] + 1) % totalImages
        }

        return {
          activePlaceIndex: (pointer + 1) % topPlaces.length,
          imageIndexes: nextIndexes,
        }
      })
    }, tickIntervalMs)

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
          {topPlaces.map((place, placeIndex) => {
            const image = pickCoverImage(place.collageImages, sliderState.imageIndexes[placeIndex] ?? 0)

            return <TopPlaceCard key={place.id} image={image} place={place} />
          })}
        </div>
      </div>
    </section>
  )
}
