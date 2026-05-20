import { isAxiosError } from "axios";
import { privateApi } from "../api/privateApi";
import { Observation, User } from "../types";

interface ObservationResponse {
  id: number;
  title: string;
  img: string;
  img_thumbnail: string;
  latitude: number;
  longitude: number;
  description: string;
  date: string;
  species_name?: string | null;
}

interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  city?: string;
  date_joined: string;
  observations?: ObservationResponse[];
}

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

const mapObservationToPublication = (
  observation: ObservationResponse,
): Observation => ({
  id: observation.id.toString(),
  title: observation.title,
  img: observation.img,
  img_thumbnail: observation.img_thumbnail,
  latitude: observation.longitude,
  longitude: observation.longitude,
  description: observation.description,
  createdAt: observation.date,
  speciesName: observation.species_name ?? "",
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

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await privateApi.post("/users/change-password/", payload);
  },
};
