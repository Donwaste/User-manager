import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import userService from "../services/user.service";
import { getErrorMessage } from "../utils/getErrorMessage";
import { setTokens } from "../services/local.storage.services";
import { SignUpData, UserType, Credentials } from "../types";
import localStorageService from "../services/local.storage.services";
import { useNavigate } from "react-router-dom";

type CurrentUserState = UserType | null;

interface AuthContextType {
  signUp: (params: SignUpData) => Promise<void>;
  signIn: (params: Credentials) => Promise<void>;
  logOut: () => void;
  updateUserData: (data: Partial<UserType>) => Promise<void>;
  createUser: (
    data: Partial<UserType> & { _id: string; email: string },
  ) => Promise<void>;
  currentUser: CurrentUserState;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const httpAuth = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
  params: {
    key: import.meta.env.VITE_FIREBASE_KEY,
  },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserState>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const errorCatcher = (error: unknown) => {
    const message = getErrorMessage(error);
    setError(message);
    toast.error(message);
    setIsLoading(false);
  };

  async function signIn({ email, password }: Credentials) {
    try {
      const { data } = await httpAuth.post("accounts:signInWithPassword", {
        email,
        password,
        returnSecureToken: true,
      });
      setTokens(data);
      await getUserData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.data?.error?.code;
        const message = error.response?.data?.error?.message;
        if (code === 400 && message === "TOO_MANY_ATTEMPTS_TRY_LATER") {
          errorCatcher("Too many failed login attempts, try later.");
          throw {};
        }
        if (
          code === 400 &&
          (message === "INVALID_LOGIN_CREDENTIALS" ||
            message === "INVALID_PASSWORD" ||
            message === "EMAIL_NOT_FOUND")
        ) {
          throw { password: "Incorrect email or password" };
        }
        errorCatcher(message || error.message);
        throw {};
      }
      errorCatcher(error);
      throw {};
    }
  }

  function logOut() {
    localStorageService.removeAuthData();
    setCurrentUser(null);
    navigate("/");
  }

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  async function signUp({
    email,
    password,
    rate,
    completedMeetings,
    qualities,
    ...rest
  }: SignUpData) {
    try {
      const { data } = await httpAuth.post("accounts:signUp", {
        email,
        password,
        returnSecureToken: true,
      });
      setTokens(data);
      await createUser({
        _id: data.localId,
        email,
        rate: randomInt(1, 5),
        completedMeetings: randomInt(0, 200),
        qualities: qualities?.length
          ? qualities.map((q: any) =>
              typeof q === "object" && q !== null ? q.value : q,
            )
          : [],
        ...rest,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.data?.error?.code;
        const message = error.response?.data?.error?.message;
        if (code === 400 && message === "TOO_MANY_ATTEMPTS_TRY_LATER") {
          errorCatcher("Too many failed login attempts, try later.");
          throw {};
        }
        if (code === 400 && message === "INVALID_LOGIN_CREDENTIALS") {
          throw { password: "Incorrect password" };
        }
        errorCatcher(message || error.message);
      } else {
        errorCatcher(error);
      }
    }
  }

  async function createUser(
    data: Partial<UserType> & { _id: string; email: string },
  ) {
    try {
      const { content } = await userService.create(data);
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    }
  }

  async function updateUserData(data: Partial<UserType>) {
    try {
      const { content } = await userService.update(data);
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    }
  }

  async function getUserData() {
    try {
      const { content } = await userService.getCurrentUser();
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        currentUser,
        createUser,
        isLoading,
        error,
        signIn,
        logOut,
        updateUserData,
      }}
    >
      {!isLoading ? children : "Loading..."}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
