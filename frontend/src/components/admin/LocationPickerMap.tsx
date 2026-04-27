import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

const DEFAULT_CENTER: [number, number] = [47.0105, 28.8638];
const DEFAULT_ZOOM = 7;

function ClickCapture({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onChange(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
    },
  });
  return null;
}

export function LocationPickerMap({ lat, lng, onChange }: Props) {
  const hasMarker = Number.isFinite(lat) && Number.isFinite(lng);
  const center: [number, number] = hasMarker ? [lat, lng] : DEFAULT_CENTER;
  const coordsLabel = hasMarker
    ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    : "—";

  return (
    <div className="admin-location-picker">
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="admin-location-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasMarker ? <Marker position={[lat, lng]} /> : null}
        <ClickCapture onChange={onChange} />
      </MapContainer>
      <p className="admin-location-coords">Coordonate: {coordsLabel}</p>
    </div>
  );
}
