export interface CoordsType {
  latitude: number;
  longitude: number;
}

export interface Observation {
  id: string;
  userId: string;
  speciesId: number;
  title: string;
  img: string;
  img_thumb: string;
  description: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface CreateObservationPayload {
  // chwilowo - potem dodamy
  // speciesId: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  img: File;
  speciesId: number;
}

export interface ObservationDraft {
  title: string;
  description: string;
}

export type ObservationFilterTypes = {
  title: string;
  author: string;
  species: string;
};

export type CheckedFilterTypes = {
  title: boolean;
  author: boolean;
  species: boolean;
};
