import { isAxiosError } from "axios";
import { privateApi } from "../api/privateApi";
import { Publication, User } from "../types";

interface ObservationResponse {
  id: number;
  title: string;
  date: string;
}

interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  city?: string;
  date_joined: string;
  observations?: ObservationResponse[];
}

const mapObservationToPublication = (
  observation: ObservationResponse,
): Publication => ({
  id: observation.id.toString(),
  title: observation.title,
  createdAt: observation.date,
});

const toDateOnly = (value: string): string => value.split("T")[0] ?? value;

const mapProfileResponse = (profile: UserProfileResponse): User => ({
  id: profile.id,
  username: profile.username,
  email: profile.email,
  city: profile.city ?? "",
  joinedAt: toDateOnly(profile.date_joined),
  publications: (profile.observations ?? []).map(mapObservationToPublication),
});

export const profileService = {
  async getMyProfile(): Promise<User> {
    const response = await privateApi.get<UserProfileResponse>("/users/me/");
    return mapProfileResponse(response.data);
  },

  async getFriendProfile(friendId: string): Promise<User | null> {
    try {
      const response = await privateApi.get<UserProfileResponse>(
        `/users/${friendId}/`,
      );
      return mapProfileResponse(response.data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async updateMyProfile(city: string): Promise<User> {
    const response = await privateApi.patch<UserProfileResponse>("/users/me/", {
      city,
    });
    return mapProfileResponse(response.data);
  },
};
