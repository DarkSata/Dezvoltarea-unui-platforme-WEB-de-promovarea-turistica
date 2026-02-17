type DestinatiiMapProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>
}

export function DestinatiiMap({ mapContainerRef }: DestinatiiMapProps) {
  return (
    <div className="destinations-map-wrap">
      <div
        id="map"
        ref={mapContainerRef}
        className="destinations-map"
        role="application"
        aria-label="Harta cu destinatii"
      ></div>
      <div className="map-hint">
        <i className="fa-regular fa-hand-pointer" aria-hidden="true"></i> Truc: click pe "Vezi pe harta" ca sa zbori direct
        la marker.
      </div>
    </div>
  )
}
