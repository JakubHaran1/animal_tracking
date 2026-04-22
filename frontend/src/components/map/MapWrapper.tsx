import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { CoordsType } from "../../types";
import LocationMarker from "./LocationMarker";
export default function MapWrapper() {
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
    <section className=" w-full h-full relative z-0">
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
          <LocationMarker />
        </MapContainer>
      ) : (
        <p>fake is loading...</p>
      )}
    </section>
  );
}
