import { postData } from "../api/publicApi";
import { CredentialsType, User } from "../types";

interface LoginResponse {
  tokens: { refresh: string; access: string };
  user: User;
  detail?: string;
}

export const authService = {
  async loginUser(data: CredentialsType): Promise<LoginResponse> {
    const res = await postData<LoginResponse>("/users/login/", data);

    localStorage.setItem("access", res.tokens.access);
    localStorage.setItem("refresh", res.tokens.refresh);

    return res;
  },
};

// Tutaj zarządzanie auth - logowanie itp, gdyby było potrzebne zarządzanie localstorage z poziomu komponenta to tez tu
