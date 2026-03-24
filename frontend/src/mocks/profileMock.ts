import { User } from "../types";

export const profileMock: User = {
  id: "u-1",
  username: "geoExplorer",
  email: "geoexplorer@example.com",
  city: "Kraków",
  joinedAt: "2024-10-02",
  publications: [
    { id: "p-u1-1", title: "Tropy sarny w lesie miejskim", createdAt: "2026-02-11" },
    { id: "p-u1-2", title: "Zimujące łabędzie nieme", createdAt: "2026-02-28" },
    { id: "p-u1-3", title: "Borsuk przy szlaku", createdAt: "2026-03-16" },
  ],
};
