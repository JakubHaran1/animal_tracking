export interface Observation {
  id: string;
  userId: string;
  speciesId: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface CreateObservationPayload {
  userId: string;
  speciesId: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}
