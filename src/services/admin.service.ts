import httpService from "./http.service";
import userApi from "../api/fake.api/user.api";
import { UserType } from "../types";

const adminId = import.meta.env.VITE_ADMIN_ID;

export const adminService = {
  resetDatabase: async (): Promise<void> => {
    const { data } = await httpService.get("users");
    const currentUsers: UserType[] = data.content;
    const usersToDelete = currentUsers.filter((user) => user._id !== adminId);

    if (usersToDelete.length > 0) {
      await Promise.all(
        usersToDelete.map((user) => httpService.delete(`users/${user._id}`)),
      );
    }
    await httpService.delete("comments");
    const defaultUsers = await userApi.fetchAll();
    await Promise.all(
      defaultUsers.map((user) => httpService.put(`users/${user._id}`, user)),
    );
  },
};

export default adminService;
