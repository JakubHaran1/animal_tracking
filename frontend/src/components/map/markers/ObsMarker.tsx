import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Observation } from "../../../types";

import { ObservationIcon } from "../icons/ObservationIcon";
import { useRef, useEffect } from "react";

type ObsMarkerProps = {
  setIsOpenObsModal: React.Dispatch<React.SetStateAction<boolean>>;
  openObservation: Observation | null;
  setOpenObservation: React.Dispatch<React.SetStateAction<Observation | null>>;
  observation: Observation;
};

export default function ObsMarker({
  setIsOpenObsModal,
  openObservation,
  setOpenObservation,
  observation,
}: ObsMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const mapInstance = useMap();
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (openObservation?.id === observation.id) {
      marker.openPopup();
      mapInstance.flyTo(marker.getLatLng());
    } else marker.closePopup();
  }, [openObservation]);
  return (
    <Marker
      ref={markerRef}
      position={[observation.latitude, observation.longitude]}
      icon={ObservationIcon}
      eventHandlers={{
        click: () => {
          if (openObservation?.id === observation.id) setOpenObservation(null);
          else setOpenObservation(observation);
        },
        popupclose: () => {
          setOpenObservation(null);
        },
      }}
    >
      <Popup className="custom-popup" minWidth={200} maxWidth={200}>
        <h3 className="overflow-hidden border-b-1 pb-1 mb-0 ">
          <p className="me-2 italic">Tytuł:</p>
          <span className="block ml-1">{observation.title}</span>
        </h3>
        <p>
          {" "}
          <span className="block italic ">Gatunek:</span>
          <span className="block ml-1"> {observation.speciesName}</span>
        </p>
        <p className="line-clamp-4 ">
          <span className="italic block">Opis:</span>
          <span className="italic block ml-1"> {observation.description}</span>
        </p>
        <p className="line-clamp-4 "></p>
        <button
          onClick={() => setIsOpenObsModal(true)}
          type="button"
          className="rounded-md bg-amber-400 px-3 py-1 text-sm font-semibold text-green-950 transition hover:bg-amber-300 2xl:px-4 2xl:py-1.5 2xl:text-base"
        >
          Zobacz więcej
        </button>
      </Popup>
    </Marker>
  );
}
