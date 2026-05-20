import { Observation } from "./observation";
export interface User {
  id: string;
  username: string;
  email: string;
  city: string;
  joinedAt: string;
  publications: Observation[];
  is_verified: boolean;
}
