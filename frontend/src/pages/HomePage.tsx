import { useEffect, useState } from "react";
import { AddObservationModal, MapPlaceholder, ObservationDraft } from "../components";
import { useAuth } from "../context/AuthContext";
import { observationsService } from "../services";
import { Observation } from "../types";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isAddObservationOpen, setIsAddObservationOpen] = useState(false);

  useEffect(() => {
    observationsService.getObservations().then(setObservations);
  }, []);

  const handleAddObservation = (draft: ObservationDraft) => {
    const newObservation: Observation = {
      id: `local-${Date.now()}`,
      species: draft.title,
      latitude: 0,
      longitude: 0,
      createdAt: new Date().toISOString(),
    };

    setObservations((current) => [newObservation, ...current]);
  };

  return (
    <>
      <MapPlaceholder
        observations={observations}
        canAddObservation={isAuthenticated}
        onAddObservationClick={() => setIsAddObservationOpen(true)}
      />
      <AddObservationModal
        isOpen={isAddObservationOpen}
        onClose={() => setIsAddObservationOpen(false)}
        onSubmit={handleAddObservation}
      />
    </>
  );
}
