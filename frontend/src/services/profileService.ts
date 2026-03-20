import { profileMock } from "../mocks";
import { User } from "../types";

export const profileService = {
  async getMyProfile(): Promise<User> {
    return Promise.resolve(profileMock);
  },
};
