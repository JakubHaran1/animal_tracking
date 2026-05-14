import { privateApi } from "../api/privateApi";
import {
  CreateObservationPayload,
  Observation,
  BoundsType,
  ObservationFilterTypes,
} from "../types";

export const observationsService = {
  async getObservations(
    bounds: BoundsType,
    queryObj: ObservationFilterTypes,
  ): Promise<Observation[]> {
    const params =
      queryObj.title || queryObj.author || queryObj.species
        ? {
            title: queryObj.title || undefined,
            author: queryObj.author || undefined,
            species: queryObj.species || undefined,
          }
        : {
            _northEast_lat: bounds._northEast.lat,
            _northEast_lng: bounds._northEast.lng,
            _southWest_lat: bounds._southWest.lat,
            _southWest_lng: bounds._southWest.lng,
          };

    const response = await privateApi.get("/observations", {
      params,
    });

    return response.data;
  },

  async createObservation(payload: CreateObservationPayload) {
    let form_data = new FormData();
    console.log(payload.description);
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
