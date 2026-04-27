import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { postData } from "./publicApi";

const privateApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: { "Content-Type": "application/json" },
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
  const resp = await privateApi.get(url);
  return resp.data;
}

export { privateApi, getDataAuth };
