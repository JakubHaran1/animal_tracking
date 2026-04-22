export interface CoordsType {
  latitude: number;
  longitude: number;
}

export interface Observation {
  id: string;
  userId: string;
  speciesId: number;
  title: string;
  description: string;
  coords: CoordsType;
  createdAt: string;
}

export interface CreateObservationPayload {
  userId: string;
  speciesId: number;
  title: string;
  description: string;
  coords: CoordsType;
}
