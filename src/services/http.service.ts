import axios from "axios";
import { toast } from "react-toastify";
import configFile from "../configFile.json";
import { httpAuth } from "../hooks/useAuth";
import localStorageService from "./local.storage.services";

const http = axios.create({
  baseURL: configFile.apiEndpoint,
});

http.interceptors.request.use(
  async function (config) {
    if (configFile.isFireBase) {
      const containSlash = /\/$/gi.test(config.url || "");
      config.url =
        (containSlash ? config.url?.slice(0, -1) : config.url) + ".json";

      const expiresDate = localStorageService.getTokenExpiresDate();
      const refreshToken = localStorageService.getRefreshToken();

      if (refreshToken && expiresDate && Number(expiresDate) < Date.now()) {
        try {
          const { data } = await httpAuth.post("token", {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          });

          localStorageService.setTokens({
            refreshToken: data.refresh_token,
            idToken: data.id_token,
            expiresIn: data.expires_in,
            localId: data.user_id,
          });
        } catch (error) {
          localStorageService.removeAuthData();
          window.location.href = "/";
          return Promise.reject(error);
        }
      }

      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.params = { ...config.params, auth: accessToken };
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (res) => {
    let transformedData = res.data;

    if (
      configFile.isFireBase &&
      transformedData &&
      typeof transformedData === "object" &&
      !Array.isArray(transformedData) &&
      !transformedData._id
    ) {
      transformedData = Object.keys(transformedData).map((key) => ({
        ...transformedData[key],
        _id: key,
      }));
    }

    res.data = { content: transformedData || [] };
    return res;
  },
  function (error) {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedErrors) {
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
