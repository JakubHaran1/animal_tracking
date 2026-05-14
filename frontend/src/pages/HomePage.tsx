import { AddObservationModal, MapPlaceholder } from "../components";

import { ObservationProvider } from "../context/ObservationContext";

export function HomePage() {
  return (
    <>
      <ObservationProvider>
        <MapPlaceholder />
        <AddObservationModal />
      </ObservationProvider>
    </>
  );
}
