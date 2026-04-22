import { postData } from "../api/publicApi";
import { getDataAuth } from "../api/privateApi";
import { CredentialsType, User } from "../types";

interface LoginResponse {
  tokens: { refresh: string; access: string };
  detail?: string;
}

export const authService = {
  async loginUser(data: CredentialsType): Promise<LoginResponse> {
    const res = await postData<LoginResponse>("/users/login/", data);

    localStorage.setItem("access", res.tokens.access);
    localStorage.setItem("refresh", res.tokens.refresh);

    return res;
  },
  async getUser(): Promise<User> {
    const res = await getDataAuth<User>("/users/me/");
    return res;
  },
};

// Tutaj zarządzanie auth - logowanie itp, gdyby było potrzebne zarządzanie localstorage z poziomu komponenta to tez tu
