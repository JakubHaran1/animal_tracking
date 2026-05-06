import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import { CoordsType } from "../../types";

export default function LocationMarker({
  handleMapClick,
}: {
  handleMapClick: (coords: CoordsType) => void;
}) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMapEvents({
    click(clickEv) {
      setPosition(clickEv.latlng);
      map.locate();
      handleMapClick({
        latitude: clickEv.latlng.lat,
        longitude: clickEv.latlng.lng,
      });
    },
    locationfound(e) {
      console.log(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
