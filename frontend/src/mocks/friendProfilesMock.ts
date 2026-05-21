import { User } from "../types";

export const friendProfilesMock: Record<string, User> = {
  "f-1": {
    id: "f-1",
    username: "anna_fieldnotes",
    email: "anna@example.com",
    city: "Wrocław",
    joinedAt: "2024-06-14",
    publications: [
      { id: "p-f1-1", title: "Gniazda bociana białego", createdAt: "2026-02-18" },
      { id: "p-f1-2", title: "Ślady bobra nad Odrą", createdAt: "2026-03-03" },
    ],
  },
  "f-2": {
    id: "f-2",
    username: "michal_tracks",
    email: "michal@example.com",
    city: "Poznań",
    joinedAt: "2023-11-08",
    publications: [
      { id: "p-f2-1", title: "Lis na obrzeżach miasta", createdAt: "2026-01-27" },
    ],
  },
  "f-3": {
    id: "f-3",
    username: "zosia_eco",
    email: "zosia@example.com",
    city: "Gdańsk",
    joinedAt: "2025-01-19",
    publications: [
      { id: "p-f3-1", title: "Mewa srebrzysta — sezon lęgowy", createdAt: "2026-03-10" },
      { id: "p-f3-2", title: "Wydra przy Martwej Wiśle", createdAt: "2026-03-14" },
      { id: "p-f3-3", title: "Nietoperze w parku miejskim", createdAt: "2026-03-19" },
    ],
  },
};
