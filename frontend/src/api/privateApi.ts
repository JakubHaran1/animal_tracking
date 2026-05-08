import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { postData } from "./publicApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/";

const privateApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",

  timeout: 10000,
});

// Interceptor do obsługi wychodzących requestów wymagających auth
privateApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor do obsługi refresh
privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Musi byc any aby dodac zmienna, chyba zeby jakos extendować type
    const originalRequest: any = error.config;

    if (
      (error.response?.status == 401 || error.response?.status == 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) return Promise.reject(error);

        const { access } = await postData<{ access: string }>(
          "/token/refresh/",
          {
            refresh: refreshToken,
          },
        );

        originalRequest.headers.Authorization = `Bearer ${access}`;

        localStorage.setItem("access", access);

        return privateApi(originalRequest);
      } catch (err) {
        localStorage.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

async function getDataAuth<T>(url: string): Promise<T> {
  const resp = await privateApi.get(url, {
    headers: { "Content-Type": "application/json" },
  });
  return resp.data;
}

async function postObservation<T>(url: string, data: FormData): Promise<T> {
  const resp = await privateApi.post(url, data);
  return resp.data;
}
export { privateApi, getDataAuth, postObservation };
