import { AddObservationModal, MapPlaceholder } from "../components";
import { useAuth } from "../context/AuthContext";

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
