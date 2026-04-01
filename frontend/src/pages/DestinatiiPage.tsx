import { useEffect, useRef, useState } from 'react'
import type { Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Lightbox } from '../components/Lightbox'
import { navLinks } from '../data/home/navLinks'
import { categoryLabel, chipOrder, fallbackImage, markerIconByCategory } from '../data/destinatii/meta'
import { useFilteredDestinations } from '../hooks/useFilteredDestinations'
import { useLeafletMap } from '../hooks/useLeafletMap'
import { useDestinatiiMarkers } from '../hooks/useDestinatiiMarkers'
import { useLightbox } from '../hooks/useLightbox'
import { useScrollToSection } from '../hooks/useScrollToSection'
import { DestinatiiHero } from '../sections/DestinatiiHero'
import { DestinatiiMapSection } from '../sections/DestinatiiMapSection'
import { escapeHtml } from '../utils/string'
import type { CategoryFilter, Category, Destination } from '../types/destinatii'
import type { Destination as ApiDestination } from '../types/destination'
import { destinationsService } from '../services/destinationsService'

function mapApiToLocal(d: ApiDestination): Destination {
  return {
    id: d.id,
    name: d.name,
    category: d.cat as Category,
    region: d.area,
    description: d.description,
    tips: d.tips,
    lat: d.lat,
    lng: d.lng,
    image: d.image ?? fallbackImage,
  }
}

type DestinatiiPageProps = { sectionId?: string; yearText: string }
export function DestinatiiPage({ sectionId = '', yearText }: DestinatiiPageProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('toate')
  const { lightboxDestination, setLightboxDestination } = useLightbox()
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markerByIdRef = useRef<Record<string, Marker>>({})
  const { mapRef, markersLayerRef } = useLeafletMap(mapContainerRef)
  const filteredDestinations = useFilteredDestinations(destinations, query, activeCategory)

  useEffect(() => {
    let mounted = true
    destinationsService.list().then(items => {
      if (!mounted) return
      setDestinations(items.map(mapApiToLocal))
    }).catch(() => { /* show empty list on error */ })
    return () => { mounted = false }
  }, [])
  useDestinatiiMarkers({
    filteredDestinations,
    mapRef,
    markersLayerRef,
    markerByIdRef,
    categoryLabel,
    markerIconByCategory,
    escapeHtml,
  })
  useScrollToSection(sectionId, true)

  const flyToDestination = (destination: Destination) => {
    const map = mapRef.current
    const marker = markerByIdRef.current[destination.id]
    if (!map || !marker) return
    map.flyTo([destination.lat, destination.lng], 11, { duration: 1.2 })
    marker.openPopup()
  }

  return (
    <div className="destinatii-page">
      <SiteHeader navLinks={navLinks} activeLabel="Destinații" brandHref="#/" breakpoint={720} />
      <main>
        <DestinatiiHero />
        <DestinatiiMapSection
          query={query}
          onQueryChange={setQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          destinations={filteredDestinations}
          chipOrder={chipOrder}
          categoryLabel={categoryLabel}
          markerIconByCategory={markerIconByCategory}
          fallbackImage={fallbackImage}
          onOpenLightbox={setLightboxDestination}
          onFlyTo={flyToDestination}
          mapContainerRef={mapContainerRef}
        />
      </main>
      <SiteFooter yearText={yearText} />
      <Lightbox destination={lightboxDestination} onClose={() => setLightboxDestination(null)} />
    </div>
  )
}
