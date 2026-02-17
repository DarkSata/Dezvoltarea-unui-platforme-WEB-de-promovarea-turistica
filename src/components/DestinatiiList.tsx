import type { Destination, Category } from '../types/destinatii'
import { DestinationCard } from './DestinationCard'

type DestinatiiListProps = {
  destinations: Destination[]
  categoryLabel: Record<string, string>
  markerIconByCategory: Record<Category, string>
  fallbackImage: string
  onOpenLightbox: (destination: Destination) => void
  onFlyTo: (destination: Destination) => void
}

export function DestinatiiList({
  destinations,
  categoryLabel,
  markerIconByCategory,
  fallbackImage,
  onOpenLightbox,
  onFlyTo,
}: DestinatiiListProps) {
  return (
    <aside className="destinations-list" aria-label="Lista destinatiilor">
      <div className="destinations-meta">
        <strong>{destinations.length}</strong>
        <span className="muted">locuri afisate</span>
      </div>

      <div id="cards" className="grid cards destinations-cards">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            categoryLabel={categoryLabel}
            markerIconByCategory={markerIconByCategory}
            fallbackImage={fallbackImage}
            onOpenLightbox={onOpenLightbox}
            onFlyTo={onFlyTo}
          />
        ))}
      </div>
    </aside>
  )
}
