import { Marker, Popup, useMapEvents } from "react-leaflet";

import { useObservationContext } from "../../context/ObservationContext";

export default function LocationMarker() {
  const { handleMapClick, activeObservationCoords, activeMarker } =
    useObservationContext();

  const map = useMapEvents({
    click(clickEv) {
      map.locate();
      handleMapClick(clickEv.latlng);
    },
    // locationfound(e) {
    //   console.log(e.latlng);
    //   map.flyTo(e.latlng, map.getZoom());
    // },
  });

  return activeObservationCoords === null ? null : (
    <Marker
      position={[
        activeObservationCoords.latitude,
        activeObservationCoords.longitude,
      ]}
      ref={activeMarker}
    >
      <Popup>You are here</Popup>
    </Marker>
  );
}
