import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { LatLng } from "leaflet";
export default function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMapEvents({
    click(clickEv) {
      setPosition(clickEv.latlng);
      map.locate();
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
