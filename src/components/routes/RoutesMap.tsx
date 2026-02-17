import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap, ZoomControl } from "react-leaflet";
import type { TouristRoute, RoutePoi } from "../../types/routes";

type Props = {
  selectedRoute: TouristRoute | null;
};

function commonsImg(fileName: string, width = 900) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

const FALLBACK_IMG = commonsImg("Moldova_Orheiul_Vechi.jpg", 900);

function MapViewportController({
  selectedRoute,
  activePoi,
}: {
  selectedRoute: TouristRoute | null;
  activePoi: RoutePoi | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedRoute) return;
    map.fitBounds(selectedRoute.line, { padding: [40, 40] });
  }, [map, selectedRoute]);

  useEffect(() => {
    if (!activePoi) return;
    map.setView([activePoi.lat, activePoi.lng], Math.max(map.getZoom(), 13), { animate: true });
  }, [activePoi, map]);

  return null;
}

export function RoutesMap({ selectedRoute }: Props) {
  const [focusedPoi, setFocusedPoi] = useState<{ routeId: string; index: number } | null>(null);

  const activePoi = useMemo<RoutePoi | null>(() => {
    if (!selectedRoute || !focusedPoi) return null;
    if (focusedPoi.routeId !== selectedRoute.id) return null;
    return selectedRoute.points[focusedPoi.index] ?? null;
  }, [focusedPoi, selectedRoute]);

  const poiImage = useMemo(() => {
    if (!activePoi?.img) return FALLBACK_IMG;
    return activePoi.img.startsWith("http") ? activePoi.img : commonsImg(activePoi.img, 900);
  }, [activePoi]);

  return (
    <div className="destinations-map-wrap">
      <MapContainer center={[47.2, 28.5]} zoom={8} className="destinations-map" zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedRoute ? (
          <>
            <Polyline positions={selectedRoute.line} pathOptions={{ color: "#6affcc", weight: 5 }} />
            {selectedRoute.points.map((poi, index) => (
              <Marker
                key={`${selectedRoute.id}-${poi.title}-${poi.lat}-${poi.lng}`}
                position={[poi.lat, poi.lng]}
                eventHandlers={{
                  click: () => setFocusedPoi({ routeId: selectedRoute.id, index }),
                }}
              >
                <Popup>{poi.title}</Popup>
              </Marker>
            ))}
          </>
        ) : null}

        <MapViewportController selectedRoute={selectedRoute} activePoi={activePoi} />
      </MapContainer>

      <aside className={`poi-panel ${activePoi ? "open" : ""}`} aria-live="polite">
        <button className="poi-close" type="button" aria-label="Închide panoul" onClick={() => setFocusedPoi(null)}>
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <div className="poi-media">
          <img
            src={poiImage}
            alt={activePoi ? `Imagine: ${activePoi.title}` : ""}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMG;
            }}
          />
        </div>

        <div className="poi-content">
          <div className="poi-title">{activePoi?.title ?? "Alege un punct de oprire"}</div>
          <div className="poi-text">
            {activePoi?.desc ?? "Apasă pe un marker de pe hartă ca să vezi imagine și detalii scurte."}
          </div>
        </div>
      </aside>

      <div className="map-hint">Apasă „Vezi ruta”, apoi click pe marker pentru detalii</div>
    </div>
  );
}
