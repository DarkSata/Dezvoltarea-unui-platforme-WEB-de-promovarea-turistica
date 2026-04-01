import { useEffect } from 'react'
import L from 'leaflet'
import type { Destination, Category } from '../types/destinatii'

type MarkerDeps = {
  filteredDestinations: Destination[]
  mapRef: React.RefObject<L.Map | null>
  markersLayerRef: React.RefObject<L.LayerGroup | null>
  markerByIdRef: React.MutableRefObject<Record<string, L.Marker>>
  categoryLabel: Record<string, string>
  markerIconByCategory: Record<Category, string>
  escapeHtml: (value: string) => string
}

function buildMarkerIcon(category: Category, markerIconByCategory: Record<Category, string>) {
  return L.divIcon({
    className: 'dest-icon',
    html: `<div class="marker"><i class="${markerIconByCategory[category]}" aria-hidden="true"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  })
}

export function useDestinatiiMarkers({
  filteredDestinations,
  mapRef,
  markersLayerRef,
  markerByIdRef,
  categoryLabel,
  markerIconByCategory,
  escapeHtml,
}: MarkerDeps) {
  useEffect(() => {
    const map = mapRef.current
    const layerGroup = markersLayerRef.current
    if (!map || !layerGroup) return

    layerGroup.clearLayers()
    markerByIdRef.current = {}
    const bounds: Array<[number, number]> = []

    filteredDestinations.forEach((destination) => {
      const marker = L.marker([destination.lat, destination.lng], {
        icon: buildMarkerIcon(destination.category, markerIconByCategory),
        title: destination.name,
      })
      const popupHtml = `
        <div class="popup">
          <strong>${escapeHtml(destination.name)}</strong>
          <div class="popup-tags">
            <span class="pill">${escapeHtml(categoryLabel[destination.category])}</span>
            <span class="pill">${escapeHtml(destination.region)}</span>
          </div>
          <p class="popup-desc">${escapeHtml(destination.description)}</p>
          <p class="popup-tips"><i class="fa-regular fa-lightbulb" aria-hidden="true"></i> ${escapeHtml(destination.tips)}</p>
        </div>
      `
      marker.bindPopup(popupHtml)
      marker.addTo(layerGroup)
      markerByIdRef.current[destination.id] = marker
      bounds.push([destination.lat, destination.lng])
    })

    if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40] })
    else if (bounds.length === 1) map.setView(bounds[0], 11)
    else map.setView([47.1, 28.7], 7)
  }, [filteredDestinations, mapRef, markersLayerRef, markerByIdRef, categoryLabel, markerIconByCategory, escapeHtml])
}
