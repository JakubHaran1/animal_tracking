import { Marker, Popup } from "react-leaflet";
import { ObservationIcon } from "../icons/ObservationIcon";
import { Observation } from "../../../types";

type ObsMarkerProps = {
  observation: Observation;
};
export default function ObsMarker({ observation }: ObsMarkerProps) {
  // const { handleMapClick, activeObservationCoords, activeMarker } =
  //   useObservationContext();

  // const map = useMapEvents({
  //   click(clickEv) {
  //     map.locate();
  //     handleMapClick(clickEv.latlng);
  //   },
  //   // locationfound(e) {
  //   //   console.log(e.latlng);
  //   //   map.flyTo(e.latlng, map.getZoom());
  //   // },
  // });

  return (
    <Marker
      position={[observation.latitude, observation.longitude]}
      icon={ObservationIcon}
    >
      <Popup>You are here</Popup>
    </Marker>
  );
}
