import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { CoordsType } from "../../types";

export default function MapWrapper({
  canAddObservation,
}: {
  canAddObservation: boolean;
}) {
  const [coords, setCoords] = useState<CoordsType | undefined>(undefined);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (geolocation: GeolocationPosition) => {
        const { latitude, longitude } = geolocation.coords;
        setCoords({ latitude, longitude });
      },
    );
  }, []);
  return (
    <section className="h-full w-full">
      {coords ? (
        <MapContainer
          center={[coords?.latitude, coords?.longitude]}
          zoom={19}
          scrollWheelZoom={true}
          className="h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {canAddObservation && <LocationMarker />}
        </MapContainer>
      ) : (
        <p>fake is loading...</p>
      )}
    </section>
  );
}
