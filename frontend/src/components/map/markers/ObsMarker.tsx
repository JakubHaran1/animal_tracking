import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Observation } from "../../../types";

import { ObservationIcon } from "../icons/ObservationIcon";
import { useRef, useEffect } from "react";

type ObsMarkerProps = {
  openObservationID: string;
  setOpenObservationID: React.Dispatch<React.SetStateAction<string>>;
  observation: Observation;
};

export default function ObsMarker({
  openObservationID,
  setOpenObservationID,
  observation,
}: ObsMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const mapInstance = useMap();
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    if (openObservationID === observation.id) {
      marker.openPopup();
      mapInstance.flyTo(marker.getLatLng());
    } else marker.closePopup();
  }, [openObservationID]);
  return (
    <Marker
      ref={markerRef}
      position={[observation.latitude, observation.longitude]}
      icon={ObservationIcon}
      eventHandlers={{
        click: () => {
          if (openObservationID === observation.id) setOpenObservationID("");
          else setOpenObservationID(observation.id);
        },
        popupclose: () => {
          setOpenObservationID("");
        },
      }}
    >
      <Popup className="custom-popup" minWidth={200} maxWidth={200}>
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
