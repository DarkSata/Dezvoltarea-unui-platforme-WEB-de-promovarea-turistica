import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { OfficeLocation } from "../../types/contact";

type ContactMapProps = {
  office: OfficeLocation;
};

export function ContactMap({ office }: ContactMapProps) {
  const markerIcon = L.divIcon({
    className: "dest-icon",
    html: '<div class="marker"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 28],
  });

  return (
    <article className="card contact-card">
      <div className="card-body">
        <h3>Unde ne gasesti</h3>
        <p className="muted">
          Punct informativ demonstrativ in {office.city}. Putem schimba locatia oricand apare un sediu oficial.
        </p>

        <div className="contact-map-wrap">
          <MapContainer center={[office.lat, office.lng]} zoom={14} className="contact-map" scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[office.lat, office.lng]} icon={markerIcon}>
              <Popup>
                <strong>{office.name}</strong>
                <br />
                {office.address}, {office.city}
                <br />
                Program: {office.schedule}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </article>
  );
}
