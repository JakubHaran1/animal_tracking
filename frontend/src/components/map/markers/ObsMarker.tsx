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
      <Popup className="custom-popup " minWidth={200} maxWidth={200}>
        <h3 className="overflow-hidden border-b-1 pb-2 ">
          {observation.title}
        </h3>

        <p className="line-clamp-3 mt-2 px-1 ">{observation.description}</p>
        <button
          type="button"
          className="rounded-md bg-amber-400 px-3 py-1 text-sm font-semibold text-green-950 transition hover:bg-amber-300 2xl:px-4 2xl:py-1.5 2xl:text-base"
        >
          Zobacz więcej
        </button>
      </Popup>
    </Marker>
  );
}
