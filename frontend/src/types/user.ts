import { Publication } from "./publication";

export interface User {
  id: string;
  username: string;
  email: string;
  city: string;
  joinedAt: string;
  publications: Publication[];
}
