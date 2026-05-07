import { privateApi } from "../api/privateApi";
import {
  FriendListItem,
  FriendRequest,
  FriendRequestStatus,
  FriendSummary,
} from "../types";

interface FriendSummaryResponse {
  id: string;
  username: string;
  avatar?: string;
}

interface FriendRequestResponse {
  id: number;
  from_user: FriendSummaryResponse;
  to_user: FriendSummaryResponse;
  status: FriendRequestStatus;
  created_at: string;
  updated_at: string;
}

const mapFriendSummary = (friend: FriendSummaryResponse): FriendSummary => ({
  id: friend.id,
  username: friend.username,
  avatar: friend.avatar,
});

const mapFriendListItem = (friend: FriendSummaryResponse): FriendListItem => ({
  ...mapFriendSummary(friend),
  mutualObservations: 0,
});

const mapFriendRequest = (request: FriendRequestResponse): FriendRequest => ({
  id: request.id,
  fromUser: mapFriendSummary(request.from_user),
  toUser: mapFriendSummary(request.to_user),
  status: request.status,
  createdAt: request.created_at,
  updatedAt: request.updated_at,
});

export const friendsService = {
  async getFriends(): Promise<FriendListItem[]> {
    const response = await privateApi.get<FriendSummaryResponse[]>("/friends/");
    return response.data.map(mapFriendListItem);
  },

  async getFriendIds(): Promise<string[]> {
    const friends = await friendsService.getFriends();
    return friends.map((friend) => friend.id);
  },

  async removeFriend(friendId: string): Promise<FriendListItem[]> {
    await privateApi.delete(`/friends/${friendId}/`);
    return friendsService.getFriends();
  },

  async searchUsers(query: string): Promise<FriendSummary[]> {
    const response = await privateApi.get<FriendSummaryResponse[]>("/users/", {
      params: { search: query },
    });
    return response.data.map(mapFriendSummary);
  },

  async getFriendRequests(): Promise<FriendRequest[]> {
    const response = await privateApi.get<FriendRequestResponse[]>(
      "/friend-requests/",
    );
    return response.data.map(mapFriendRequest);
  },

  async sendFriendRequest(userId: string): Promise<FriendRequest> {
    const response = await privateApi.post<FriendRequestResponse>(
      "/friend-requests/",
      { to_user_id: userId },
    );
    return mapFriendRequest(response.data);
  },

  async respondToFriendRequest(
    requestId: number,
    status: FriendRequestStatus,
  ): Promise<FriendRequest> {
    const response = await privateApi.patch<FriendRequestResponse>(
      `/friend-requests/${requestId}/`,
      { status },
    );
    return mapFriendRequest(response.data);
  },
};
