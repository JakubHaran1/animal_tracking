import { observationsMock } from "../mocks";
import { CreateObservationPayload, Observation } from "../types";

let localObservations = [...observationsMock];

export const observationsService = {
  async getObservations(): Promise<Observation[]> {
    return Promise.resolve([...localObservations]);
  },

  async getObservationsByUserIds(userIds: string[]): Promise<Observation[]> {
    return Promise.resolve(
      localObservations.filter((observation) => userIds.includes(observation.userId)),
    );
  },

  async createObservation(payload: CreateObservationPayload): Promise<Observation> {
    const newObservation: Observation = {
      id: `o-local-${Date.now()}`,
      userId: payload.userId,
      speciesId: payload.speciesId,
      title: payload.title,
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude,
      createdAt: new Date().toISOString(),
    };

    localObservations = [newObservation, ...localObservations];

    return Promise.resolve(newObservation);
  },
};
