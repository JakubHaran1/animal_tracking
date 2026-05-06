import { postObservation } from "../api/privateApi";
import { observationsMock } from "../mocks";
import { CreateObservationPayload, Observation } from "../types";

let localObservations = [...observationsMock];

export const observationsService = {
  async getObservations(): Promise<Observation[]> {
    return Promise.resolve([...localObservations]);
  },

  async getObservationsByUserIds(userIds: string[]): Promise<Observation[]> {
    return Promise.resolve(
      localObservations.filter((observation) =>
        userIds.includes(observation.userId),
      ),
    );
  },

  async createObservation(payload: CreateObservationPayload) {
    let form_data = new FormData();

    form_data.append("img", payload.img);
    form_data.append("title", payload.title);
    form_data.append("description", payload.description);
    form_data.append("latitude", payload.latitude.toFixed(6));
    form_data.append("longitude", payload.longitude.toFixed(6));
    const resp = await postObservation<CreateObservationPayload>(
      "/observations/",
      form_data,
    );
    return resp;
  },
};
