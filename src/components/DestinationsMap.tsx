import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Destination } from "../types/destination";

const icons: Record<string, string> = {
    Natura: "fa-mountain-sun",
    Vin: "fa-wine-glass",
    Manastiri: "fa-landmark-dome",
    Istorie: "fa-landmark",
    Orase: "fa-city",
};

function markerHtml(cat: string) {
    const cls = icons[cat] || "fa-location-dot";
    return `<div class="marker"><i class="fa-solid ${cls}" aria-hidden="true"></i></div>`;
}

function makeIcon(cat: string) {
    return L.divIcon({
        className: "dest-icon",
        html: markerHtml(cat),
        iconSize: [30, 30],
        iconAnchor: [15, 28],
    });
}

function FlyToSelected({
                           selected,
                           zoom = 12,
                       }: {
    selected: Destination | null;
    zoom?: number;
}) {
    const map = useMap();

    useEffect(() => {
        if (!selected) return;
        map.flyTo([selected.lat, selected.lng], zoom, { duration: 0.8 });
    }, [selected, zoom, map]);

    return null;
}

export default function DestinationsMap({
                                            places,
                                            selected,
                                            onSelect,
                                        }: {
    places: Destination[];
    selected: Destination | null;
    onSelect: (d: Destination) => void;
}) {
    return (
        <div className="destinations-map-wrap">
            <MapContainer
                className="destinations-map"
                center={[47.2, 28.6]}
                zoom={8}
                scrollWheelZoom={false}
            >
                <FlyToSelected selected={selected} />

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {places.map((p) => (
                    <Marker
                        key={p.id}
                        position={[p.lat, p.lng]}
                        icon={makeIcon(p.cat)}
                        eventHandlers={{
                            click: () => onSelect(p),
                        }}
                    >
                        <Popup>
                            <div className="popup">
                                <strong>{p.name}</strong>
                                <div className="popup-tags">
                                    <span className="pill">{p.cat}</span>
                                    <span className="pill">{p.area}</span>
                                </div>
                                <p className="popup-desc">{p.description}</p>
                                <p className="popup-tips">
                                    <i className="fa-regular fa-lightbulb"></i> {p.tips}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="map-hint">
                <i className="fa-regular fa-hand-pointer"></i> Truc: click pe „Vezi pe
                hartă” ca să zbori direct la marker.
            </div>
        </div>
    );
}
