import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import ActiveMarker from "./markers/ActiveMarker";
import { BoundsType, CoordsType, Observation } from "../../types";
import ObsMarker from "./markers/ObsMarker";
import { BoundsReader } from "./BoundsReader";

const DEFAULT_MAP_COORDS: CoordsType = {
  latitude: 52.2297,
  longitude: 21.0122,
};

type MapWrapperProps = {
  canAddObservation: boolean;
  observations: Observation[];
  setBounds: React.Dispatch<React.SetStateAction<BoundsType | null>>;
  bounds: BoundsType | null;
};
export default function MapWrapper({
  canAddObservation,
  observations,
  setBounds,
}: MapWrapperProps) {
  const [coords, setCoords] = useState<CoordsType | undefined>(undefined);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords(DEFAULT_MAP_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (geolocation: GeolocationPosition) => {
        const { latitude, longitude } = geolocation.coords;
        setCoords({ latitude, longitude });
      },
      () => {
        setCoords(DEFAULT_MAP_COORDS);
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
          <BoundsReader setBounds={setBounds} />
          {canAddObservation && <ActiveMarker />}
          {observations.length > 0 &&
            observations.map((obs) => <ObsMarker observation={obs} />)}
        </MapContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-2 shadow-sm ring-1 ring-green-200">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-green-300 border-t-green-700"
              role="status"
              aria-label="Loading map"
            />
            <p className="text-sm font-medium tracking-wide text-green-900">
              Loading
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
