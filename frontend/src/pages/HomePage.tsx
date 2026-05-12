import { useEffect, useState } from "react";
import { AddObservationModal, MapPlaceholder } from "../components";
import { useAuth } from "../context/AuthContext";
import { friendsService, observationsService } from "../services";
import { Observation, ObservationDraft } from "../types";
import { ObservationProvider } from "../context/ObservationContext";

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // chwilowo, potem pobierac po coordsach
      // observationsService
      //   .getObservationsByUserUUID(user?.id)
      //   .then(setObservations);
      return;
    }

    // To nie działa
    // friendsService
    //   .getFriendIds()
    //   .then((friendIds) =>
    //     observationsService.getObservationsByUserIds(friendIds),
    //   )
    //   .then(setObservations);
  }, [isAuthenticated]);

  const handleAddObservation = async (draft: ObservationDraft) => {
    const latitude = 0;
    const longitude = 0;
    // const createdObservation = await observationsService.createObservation({
    //   userId: "u-1",
    //   speciesId: 1,
    //   title: draft.title,
    //   description: draft.description,
    //   latitude: latitude,
    //   longitude: longitude,
    // });

    // setObservations((current) => [createdObservation, ...current]);
  };

  return (
    <>
      <ObservationProvider>
        <MapPlaceholder canAddObservation={isAuthenticated} />
        <AddObservationModal onSubmit={handleAddObservation} />
      </ObservationProvider>

      <p>test user login {user?.email ?? ""}</p>
    </>
  );
}
