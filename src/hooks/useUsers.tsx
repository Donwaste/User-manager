import { createContext, useContext, useState, useEffect } from "react";
import userService from "../services/user.service";
import { toast } from "react-toastify";
import { UserType } from "../types/user";
import { ProviderProps } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "./useAuth";

interface UserContextType {
  users: UserType[];
  isLoading: boolean;
  getUserById: (userId: string) => UserType | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }: ProviderProps) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!isLoading && currentUser) {
      const newUsers = [...users];
      const indexUser = newUsers.findIndex((u) => u._id === currentUser._id);
      if (indexUser !== -1) {
        newUsers[indexUser] = currentUser;
        setUsers(newUsers);
      }
    }
  }, [currentUser]);

  async function getUsers() {
    try {
      const { content } = await userService.get();
      setUsers(content || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function getUserById(userId: string) {
    return users.find((u) => u._id === userId);
  }

  return (
    <UserContext.Provider value={{ users, isLoading, getUserById }}>
      {!isLoading ? children : "Loading..."}
    </UserContext.Provider>
  );
};

export default UserProvider;
