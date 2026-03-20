import { friendProfilesMock, profileMock } from "../mocks";
import { User } from "../types";

export const profileService = {
  async getMyProfile(): Promise<User> {
    return Promise.resolve(profileMock);
  },

  async getFriendProfile(friendId: string): Promise<User | null> {
    return Promise.resolve(friendProfilesMock[friendId] ?? null);
  },
};
