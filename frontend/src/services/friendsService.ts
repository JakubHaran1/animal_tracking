import { friendsMock } from "../mocks";
import { Friend } from "../types";

let localFriends = [...friendsMock];

export const friendsService = {
  async getFriends(): Promise<Friend[]> {
    return Promise.resolve([...localFriends]);
  },

  async removeFriend(friendId: string): Promise<Friend[]> {
    localFriends = localFriends.filter((friend) => friend.id !== friendId);
    return Promise.resolve([...localFriends]);
  },
};
