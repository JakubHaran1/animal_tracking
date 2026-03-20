import { observationsMock } from "../mocks";
import { Observation } from "../types";

export const observationsService = {
  async getObservations(): Promise<Observation[]> {
    return Promise.resolve(observationsMock);
  },
};
