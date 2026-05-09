import { useEffect, useState } from "react";
import { AddObservationModal, MapPlaceholder } from "../components";
import { useAuth } from "../context/AuthContext";
import { friendsService, observationsService } from "../services";
import { Observation, ObservationDraft } from "../types";
import { ObservationProvider } from "../context/ObservationContext";
import { ObservationsList } from "../components/observations/ObservationsList";

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // chwilowo, potem pobierac po coordsach
      // observationsService
      //   .getObservationsByUserUUID(user?.id)
      //   .then(setObservations);
      return;
    }
    console.log(12);
    observationsService
      .getObservationsByUserUUID(user?.id)
      .then((obs) => setObservations([...obs]));

    friendsService
      .getFriendIds()
      .then((friendIds) =>
        observationsService.getObservationsByUserIds(friendIds),
      )
      .then(setObservations);
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
        <MapPlaceholder
          observations={observations}
          canAddObservation={isAuthenticated}
        />
        <AddObservationModal onSubmit={handleAddObservation} />
      </ObservationProvider>
      <ObservationsList observations={observations}></ObservationsList>
      <p>test user login {user?.email ?? ""}</p>
      <button onClick={() => console.log(observations)}>d</button>
    </>
  );
}
