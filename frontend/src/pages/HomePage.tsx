import { useEffect, useState } from "react";
import {
  AddObservationModal,
  MapPlaceholder,
  ObservationDraft,
} from "../components";
import { useAuth } from "../context/AuthContext";
import { friendsService, observationsService } from "../services";
import { Observation } from "../types";
import { ObservationProvider } from "../context/ObservationContext";

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      observationsService.getObservations().then(setObservations);
      return;
    }

    friendsService
      .getFriendIds()
      .then((friendIds) =>
        observationsService.getObservationsByUserIds(friendIds),
      )
      .then(setObservations);
  }, [isAuthenticated]);

  // Chwilowo zakomentowuje - bedziemy przekazywac longitude i latitude pojedynczo

  // const parseLocation = (location: string) => {
  //   const [latitudeRaw, longitudeRaw] = location
  //     .split(",")
  //     .map((value) => value.trim());
  //   const latitude = Number(latitudeRaw);
  //   const longitude = Number(longitudeRaw);

  //   if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
  //     return { latitude, longitude };
  //   }

  //   return { latitude: 0, longitude: 0 };
  // };

  const handleAddObservation = async (draft: ObservationDraft) => {
    const latitude = 0;
    const longitude = 0;
    const createdObservation = await observationsService.createObservation({
      userId: "u-1",
      speciesId: 1,
      title: draft.title,
      description: draft.description,
      latitude: latitude,
      longitude: longitude,
    });

    setObservations((current) => [createdObservation, ...current]);
  };

  return (
    <>
      <ObservationProvider>
        <MapPlaceholder
          observations={observations}
          canAddObservation={isAuthenticated}
        />
        <AddObservationModal onSubmit={handleAddObservation} />
      </ObservationProvider>

      <p>test user login {user?.email ?? ""}</p>
    </>
  );
}
