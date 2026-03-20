import { useEffect, useState } from "react";
import { AddObservationModal, MapPlaceholder, ObservationDraft } from "../components";
import { useAuth } from "../context/AuthContext";
import { friendsService, observationsService } from "../services";
import { Observation } from "../types";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isAddObservationOpen, setIsAddObservationOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      observationsService.getObservations().then(setObservations);
      return;
    }

    friendsService
      .getFriendIds()
      .then((friendIds) => observationsService.getObservationsByUserIds(friendIds))
      .then(setObservations);
  }, [isAuthenticated]);

  const parseLocation = (location: string) => {
    const [latitudeRaw, longitudeRaw] = location.split(",").map((value) => value.trim());
    const latitude = Number(latitudeRaw);
    const longitude = Number(longitudeRaw);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }

    return { latitude: 0, longitude: 0 };
  };

  const handleAddObservation = async (draft: ObservationDraft) => {
    const { latitude, longitude } = parseLocation(draft.location);
    const createdObservation = await observationsService.createObservation({
      userId: "u-1",
      speciesId: 1,
      title: draft.title,
      description: draft.description,
      latitude,
      longitude,
    });

    setObservations((current) => [createdObservation, ...current]);
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
