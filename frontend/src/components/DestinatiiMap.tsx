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
        aria-label="Hartă cu destinații"
      ></div>
      <div className="map-hint">
        <i className="fa-regular fa-hand-pointer" aria-hidden="true"></i> Truc: click pe "Vezi pe hartă" ca să zbori direct
        la marker.
      </div>
    </div>
  )
}
