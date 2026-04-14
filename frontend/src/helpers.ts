import type { User } from "./types";

interface ApiResponse<T> {
  status: number;
  statusText: string;
  ok: boolean;
  data: T;
  requiresAuth?: boolean;
}

interface CredentialsType {
  username: string;
  password: string;
}

interface TokensType {
  refresh: string;
  access: string;
}

async function fetchData<T>(
  url: string,
  method: string,
  data?: object,
  headers?: HeadersInit,
): Promise<ApiResponse<T>> {
  let responseData: T | undefined;
  try {
    const response = await fetch(url, {
      headers: { ...headers, "Content-Type": "application/json" },
      method: method,
      body: JSON.stringify(data),
    });

    try {
      responseData = await response.json();
    } catch {
      console.log("parser error");
    }

    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: responseData as T,
    };
  } catch (error) {
    const err = error as Error;
    console.log({
      status: 404,
      statusText: err.message,
      ok: false,
      data: responseData as T,
    });
    return {
      status: 404,
      statusText: err.message,
      ok: false,
      data: responseData as T,
    };
  }
}

async function login(data: CredentialsType) {
  const response = await fetchData<TokensType>(
    "http://127.0.0.1:8000/api/users/login/",
    "POST",
    data,
  );
  if (!response.ok) {
    return undefined;
  }

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  console.log(response);
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    console.log("Login popup");
    return null;
  }
  const response = await fetchData<string>(
    "http://127.0.0.1:8000/api/token/refresh/",
    "POST",
    { refresh: refresh },
  );

  if (!response.ok) {
    console.log("something goes wrong", response.statusText);
    return null;
  }

  localStorage.setItem("refresh", response.data);
  return response.data;
}

async function fetchAuthData<T>(
  url: string,
  method: string,
  data?: object,
): Promise<ApiResponse<T>> {
  const access = localStorage.getItem("access");
  if (!access) {
    console.log("Login");
  }
  let response = await fetchData(url, method, data, {
    Authorization: `Bearer ${access}`,
  });

  if (response.status == 401 || response.status == 403) {
    const new_token = await refreshAccessToken();
    if (!new_token) {
      console.log("Can't refresh token");

      response = await fetchData<T>(url, method, data, {
        Authorization: `Bearer ${new_token}`,
      });
    }
  }
  if (!response.ok) {
    console.log(response.statusText, response.status);
    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: response.data as T,
      requiresAuth: true,
    };
  }

  console.log(response);

  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    data: response.data as T,
  };
}

export { fetchData, login, refreshAccessToken, fetchAuthData };
