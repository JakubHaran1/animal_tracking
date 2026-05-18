import { useState } from "react";
import { AddObservationModal, MapPlaceholder } from "../components";

import { ObservationProvider } from "../context/ObservationContext";

export function HomePage() {
  const [observationSaved, setObservationSaved] = useState(false);
  return (
    <>
      <ObservationProvider>
        <MapPlaceholder observationSaved={observationSaved} />
        <AddObservationModal setObservationSaved={setObservationSaved} />
      </ObservationProvider>
    </>
  );
}
