import { useEffect, useRef } from 'react'
import L from 'leaflet'

export function useLeafletMap(mapContainerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, { zoomControl: true, attributionControl: true }).setView([47.1, 28.7], 7)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const layerGroup = L.layerGroup().addTo(map)
    mapRef.current = map
    markersLayerRef.current = layerGroup

    return () => {
      layerGroup.clearLayers()
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
    }
  }, [mapContainerRef])

  return { mapRef, markersLayerRef }
}
