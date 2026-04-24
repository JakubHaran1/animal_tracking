import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { CoordsType } from "../../types";

export default function MapWrapper({
  canAddObservation,
  handleMapClick,
}: {
  canAddObservation: boolean;
  handleMapClick: (coords: CoordsType) => void;
}) {
  const [coords, setCoords] = useState<CoordsType | undefined>(undefined);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (geolocation: GeolocationPosition) => {
        const { latitude, longitude } = geolocation.coords;
        setCoords({ latitude, longitude });

        // console.log(geolocation.coords);
        // console.log(latitude);
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
          {canAddObservation && (
            <LocationMarker handleMapClick={handleMapClick} />
          )}
        </MapContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-2 shadow-sm ring-1 ring-green-200">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-green-300 border-t-green-700"
              role="status"
              aria-label="Loading map"
            />
            <p className="text-sm font-medium tracking-wide text-green-900">Loading</p>
          </div>
        </div>
      )}
    </section>
  );
}
