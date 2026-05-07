import { Publication } from "./publication";

export interface User {
  id: string;
  username: string;
  email: string;
  city: string;
  joinedAt: string;
  publications: Publication[];
  is_verified: boolean;
  // wywaliłbym to publications bo będzie obciążać bez potrzeby - będzie trzeba przechowywać obserwacje a i tak zrobimy osobny request/podstrone
}
