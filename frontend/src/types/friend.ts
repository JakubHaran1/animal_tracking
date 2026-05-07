export interface FriendSummary {
  id: string;
  username: string;
  avatar?: string;
}

export interface FriendListItem extends FriendSummary {
  mutualObservations?: number;
}

export type FriendRequestStatus = "pending" | "accepted" | "declined" | "canceled";

export interface FriendRequest {
  id: number;
  fromUser: FriendSummary;
  toUser: FriendSummary;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
}
