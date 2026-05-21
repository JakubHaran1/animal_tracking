import { postData } from "../api/publicApi";
import { getDataAuth } from "../api/privateApi";
import { CredentialsType, RegisterPayload, User } from "../types";

interface LoginResponse {
  tokens: { refresh: string; access: string };
  detail?: string;
}

interface RegisterResponse {
  detail: string;
  user: User;
}

interface VerifyEmailResponse {
  detail: string;
}

export const authService = {
  async loginUser(data: CredentialsType): Promise<LoginResponse> {
    const res = await postData<LoginResponse>("/users/login/", data);

    localStorage.setItem("access", res.tokens.access);
    localStorage.setItem("refresh", res.tokens.refresh);

    return res;
  },
  async registerUser(data: RegisterPayload): Promise<RegisterResponse> {
    const res = await postData<RegisterResponse>("/users/", data);
    return res;
  },
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return postData<VerifyEmailResponse>("/users/verify-email/", { token });
  },
  async getUser(): Promise<User> {
    const res = await getDataAuth<User>("/users/me/");
    console.log(res);
    return res;
  },
};

// Tutaj zarządzanie auth - logowanie itp, gdyby było potrzebne zarządzanie localstorage z poziomu komponenta to tez tu
