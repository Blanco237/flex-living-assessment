import axios, { AxiosResponse, type AxiosError } from "axios";
import { generateAccessToken } from "@/actions/auth";
import APP_CONSTANTS from "./constants";

interface TokenCache {
  token: string;
  expiresAt: number;
}

let cachedToken: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const accessToken = await generateAccessToken();

  const ttlMs = 24 * 30 * 24 * 60 * 60 * 1000; // 24 months in ms (approximate as 30 days per month)

  cachedToken = {
    token: accessToken,
    expiresAt: Date.now() + ttlMs,
  };

  return accessToken;
}

function clearCachedToken() {
  cachedToken = null;
}

export const instance = axios.create({
  baseURL: APP_CONSTANTS.HOSTAWAY.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const headers = config.headers ?? {};
    if (!("Authorization" in headers) || !headers.Authorization) {
      const token = await getAccessToken();
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If 403 error, clear cached token and retry once with a fresh token
    if (error.response?.status === 403 && originalRequest) {
      clearCachedToken();

      const headers = originalRequest.headers ?? {};
      const token = await getAccessToken();
      headers.Authorization = `Bearer ${token}`;
      originalRequest.headers = headers;

      return instance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export interface HostawayResponse<T> {
  status: "success" | "failed";
  result: T;
}

export interface PaginatedResponse<T> extends HostawayResponse<Array<T>> {
  count: number;
  limit: number;
  offset: number | null;
}

class API {
  static getInstance() {
    return instance;
  }

  static setBaseURL(url: string) {
    instance.defaults.baseURL = url;
  }

  static responseBody = (response: AxiosResponse) => response.data;

  static async get(
    url: string,
    params?: Record<string, string | number | boolean | undefined>,
    signal?: AbortSignal
  ) {
    return instance.get(`${url}`, { signal, params }).then(this.responseBody);
  }

  static async post(url: string, data?: Record<string, any>) {
    return instance.post(url, data).then(this.responseBody);
  }

  static async put(url: string, data?: Record<string, any>) {
    return instance.put(url, data).then(this.responseBody);
  }

  static async patch(url: string, data?: Record<string, any>) {
    return instance.patch(url, data).then(this.responseBody);
  }

  static async delete(url: string, params?: Record<string, string>) {
    return instance.delete(`${url}`, { params }).then(this.responseBody);
  }
}

export default API;
