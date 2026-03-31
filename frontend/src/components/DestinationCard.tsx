import type { Destination, Category } from '../types/destinatii'
type DestinationCardProps = {
  destination: Destination
  categoryLabel: Record<string, string>
  markerIconByCategory: Record<Category, string>
  fallbackImage: string
  onOpenLightbox: (destination: Destination) => void
  onFlyTo: (destination: Destination) => void
}
export function DestinationCard({
  destination,
  categoryLabel,
  markerIconByCategory,
  fallbackImage,
  onOpenLightbox,
  onFlyTo,
}: DestinationCardProps) {
  return (
    <article className="card destination-card">
      <button
        className="card-media"
        type="button"
        onClick={() => onOpenLightbox(destination)}
        style={{ backgroundImage: `url('${destination.image}')` }}
        aria-label={`Mărește poza pentru ${destination.name}`}
      >
        <img
          className="media-preload"
          src={destination.image}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage
            event.currentTarget.parentElement?.setAttribute('style', `background-image: url('${fallbackImage}')`)
          }}
        />
        <div className="card-media-overlay"></div>
        <div className="card-media-top">
          <div className="mini-header">
            <div className="mini-title">
              <i className={`${markerIconByCategory[destination.category]}`} aria-hidden="true"></i>
              <span>{destination.name}</span>
            </div>
            <div className="mini-meta">{destination.region} | {categoryLabel[destination.category]}</div>
          </div>
          <span className="zoom-badge" aria-hidden="true">
            <i className="fa-solid fa-magnifying-glass-plus"></i>
          </span>
        </div>
      </button>
      <div className="card-body">
        <p>{destination.description}</p>
        <div className="dest-row">
          <span className="pill"><i className="fa-solid fa-layer-group" aria-hidden="true"></i> {categoryLabel[destination.category]}</span>
          <span className="pill"><i className="fa-solid fa-location-dot" aria-hidden="true"></i> {destination.region}</span>
        </div>
        <div className="dest-row bottom">
          <span className="pill tip"><i className="fa-regular fa-lightbulb" aria-hidden="true"></i> {destination.tips}</span>
        </div>
        <button className="btn small dest-btn" type="button" onClick={() => onFlyTo(destination)}>
          Vezi pe hartă
        </button>
      </div>
    </article>
  )
}
