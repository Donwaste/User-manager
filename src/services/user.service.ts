import httpService from "./http.service";
import localStorageService from "./local.storage.services";
import { UserType } from "../types";

interface ApiResponse<T> {
  content: T;
}

const userEndpoint = "users/";

const userService = {
  get: async (): Promise<{ content: UserType[] }> => {
    const { data } = await httpService.get(userEndpoint);
    return data;
  },
  create: async (
    payload: Partial<UserType> & { _id: string; email: string },
  ): Promise<ApiResponse<UserType>> => {
    const { data } = await httpService.put(`users/${payload._id}`, payload);
    return data;
  },
  getCurrentUser: async (): Promise<{ content: UserType }> => {
    const { data } = await httpService.get(
      `users/${localStorageService.getUserId()}`,
    );
    return data;
  },
  update: async (
    payload: Partial<UserType>,
  ): Promise<{ content: UserType }> => {
    const { data } = await httpService.patch(
      userEndpoint + localStorageService.getUserId(),
      payload,
    );
    return data;
  },
};

export default userService;
