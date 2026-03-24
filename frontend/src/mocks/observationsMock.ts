import { Observation } from "../types";

export const observationsMock: Observation[] = [
  {
    id: "o-1",
    userId: "f-1",
    speciesId: 1,
    title: "Bóbr europejski przy rzece",
    description: "Zaobserwowany przy tamie w godzinach porannych.",
    latitude: 50.0614,
    longitude: 19.9366,
    createdAt: "2026-03-01T09:45:00Z",
  },
  {
    id: "o-2",
    userId: "f-2",
    speciesId: 2,
    title: "Czapla siwa na obrzeżach stawu",
    description: "Pojedynczy osobnik podczas żerowania.",
    latitude: 52.2298,
    longitude: 21.0118,
    createdAt: "2026-03-07T11:15:00Z",
  },
  {
    id: "o-3",
    userId: "u-1",
    speciesId: 3,
    title: "Lis rudy na skraju lasu",
    description: "Obserwacja o zmierzchu przy ścieżce spacerowej.",
    latitude: 54.352,
    longitude: 18.6466,
    createdAt: "2026-03-12T07:25:00Z",
  },
];
