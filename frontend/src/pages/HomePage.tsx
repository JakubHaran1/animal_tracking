import { AddObservationModal, MapPlaceholder } from "../components";
import { useAuth } from "../context/AuthContext";

import { ObservationProvider } from "../context/ObservationContext";

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <ObservationProvider>
        <MapPlaceholder canAddObservation={isAuthenticated} />
        <AddObservationModal />
      </ObservationProvider>

      <p>test user login {user?.email ?? ""}</p>
    </>
  );
}
