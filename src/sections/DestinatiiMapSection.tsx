import type { Category, CategoryFilter, Destination } from '../types/destinatii'
import { DestinatiiToolbar } from '../components/DestinatiiToolbar'
import { DestinatiiMap } from '../components/DestinatiiMap'
import { DestinatiiList } from '../components/DestinatiiList'

type DestinatiiMapSectionProps = {
  query: string
  onQueryChange: (value: string) => void
  activeCategory: CategoryFilter
  onCategoryChange: (value: CategoryFilter) => void
  destinations: Destination[]
  chipOrder: CategoryFilter[]
  categoryLabel: Record<CategoryFilter, string>
  markerIconByCategory: Record<Category, string>
  fallbackImage: string
  onOpenLightbox: (destination: Destination) => void
  onFlyTo: (destination: Destination) => void
  mapContainerRef: React.RefObject<HTMLDivElement | null>
}

export function DestinatiiMapSection(props: DestinatiiMapSectionProps) {
  const {
    query,
    onQueryChange,
    activeCategory,
    onCategoryChange,
    destinations,
    chipOrder,
    categoryLabel,
    markerIconByCategory,
    fallbackImage,
    onOpenLightbox,
    onFlyTo,
    mapContainerRef,
  } = props

  return (
    <section className="section" id="harta">
      <div className="container">
        <div className="section-head">
          <h2>Harta locurilor</h2>
          <p>Cauta, filtreaza pe categorii si planifica usor un itinerar.</p>
        </div>

        <DestinatiiToolbar
          query={query}
          onQueryChange={onQueryChange}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          chipOrder={chipOrder}
          categoryLabel={categoryLabel}
        />

        <div className="destinations-layout">
          <DestinatiiMap mapContainerRef={mapContainerRef} />
          <DestinatiiList
            destinations={destinations}
            categoryLabel={categoryLabel}
            markerIconByCategory={markerIconByCategory}
            fallbackImage={fallbackImage}
            onOpenLightbox={onOpenLightbox}
            onFlyTo={onFlyTo}
          />
        </div>
      </div>
    </section>
  )
}
