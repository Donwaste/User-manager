import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
import configFile from "../configFile.json";
import localStorageService from "./local.storage.services";

const FIREBASE_KEY = import.meta.env.VITE_FIREBASE_KEY;
const EXPIRES_BUFFER_MS = 60 * 1000;

export const httpAuth = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
  params: { key: FIREBASE_KEY },
});

export const httpToken = axios.create({
  baseURL: "https://securetoken.googleapis.com/v1/",
  params: { key: FIREBASE_KEY },
});

export const http = axios.create({
  baseURL: configFile.apiEndpoint,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let onAuthFailure: () => void = () => {
  window.location.href = "/";
};

export function setAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler;
}

let refreshPromise: Promise<string> | null = null;

function refreshAuthTokens(refreshToken: string): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const { data } = await httpToken.post(
          "token",
          new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        );

        localStorageService.setTokens({
          refreshToken: data.refresh_token,
          idToken: data.id_token,
          expiresIn: data.expires_in,
          localId: data.user_id || localStorageService.getUserId() || "",
        });

        return data.id_token as string;
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          localStorageService.removeAuthData();
          onAuthFailure();
        }
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

function isTokenExpired(): boolean {
  const expiresDate = localStorageService.getTokenExpiresDate();
  if (!expiresDate) return false;
  return Number(expiresDate) - EXPIRES_BUFFER_MS < Date.now();
}

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!configFile.isFireBase) return config;
    const url = (config.url || "").replace(/\/$/, "");
    config.url = url.endsWith(".json") ? url : url + ".json";

    const refreshToken = localStorageService.getRefreshToken();
    if (refreshToken && isTokenExpired()) {
      await refreshAuthTokens(refreshToken);
    }

    const accessToken = localStorageService.getAccessToken();
    if (accessToken) {
      config.params = { ...config.params, auth: accessToken };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

function isFirebaseCollection(data: unknown): data is Record<string, object> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if ("_id" in data) return false;
  const values = Object.values(data);
  return (
    values.length > 0 &&
    values.every((v) => v !== null && typeof v === "object")
  );
}

http.interceptors.response.use(
  (res: AxiosResponse) => {
    let data = res.data;

    if (
      configFile.isFireBase &&
      res.config.method?.toLowerCase() === "get" &&
      isFirebaseCollection(data)
    ) {
      data = Object.keys(data).map((key) => ({
        ...(data as Record<string, object>)[key],
        _id: key,
      }));
    }

    res.data = { content: data ?? [] };
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    if (
      configFile.isFireBase &&
      error.response?.status === 401 &&
      original &&
      !original._retry
    ) {
      const refreshToken = localStorageService.getRefreshToken();
      if (refreshToken) {
        original._retry = true;
        try {
          await refreshAuthTokens(refreshToken);
          return http(original);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }

    if (axios.isAxiosError(error) && !error.response) {
      toast.error("No connection to the server", { toastId: "network-error" });
      return Promise.reject(new Error("No connection to the server"));
    }

    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      toast.error("Something went wrong. Try it later");
    }
    return Promise.reject(error);
  },
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
