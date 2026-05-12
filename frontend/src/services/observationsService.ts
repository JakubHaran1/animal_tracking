import { privateApi } from "../api/privateApi";
import { CreateObservationPayload, Observation, BoundsType } from "../types";

export const observationsService = {
  async getObservations(bounds: BoundsType): Promise<Observation[]> {
    return (
      await privateApi.get("/observations", {
        params: {
          _northEast_lat: bounds._northEast.lat,
          _northEast_lng: bounds._northEast.lng,
          _southWest_lat: bounds._southWest.lat,
          _southWest_lng: bounds._southWest.lng,
        },
      })
    ).data;
  },

  async createObservation(payload: CreateObservationPayload) {
    let form_data = new FormData();

    form_data.append("img", payload.img);
    form_data.append("title", payload.title);
    form_data.append("description", payload.description);
    form_data.append("latitude", payload.latitude.toFixed(6));
    form_data.append("longitude", payload.longitude.toFixed(6));
    const resp = await privateApi.post<CreateObservationPayload>(
      "/observations/",
      form_data,
    );

    return resp;
  },
};
