import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import localStorageService from "../services/local.storage.services";
import getRandomInt from "../utils/getRandomInt";
import { getErrorMessage } from "../utils/getErrorMessage";
import { Credentials, SignUpData, UserType } from "../types";
import type { RootState, AppDispatch } from "./store";

interface UsersState {
  entities: UserType[] | null;
  isLoading: boolean;
  error: string | null;
  auth: { userId: string } | null;
  isLoggedIn: boolean;
  dataLoaded: boolean;
}

const initialState: UsersState = localStorageService.getAccessToken()
  ? {
      entities: null,
      isLoading: true,
      error: null,
      auth: { userId: localStorageService.getUserId()! },
      isLoggedIn: true,
      dataLoaded: false,
    }
  : {
      entities: null,
      isLoading: false,
      error: null,
      auth: null,
      isLoggedIn: false,
      dataLoaded: false,
    };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
    },
    usersReceived: (state, action: PayloadAction<UserType[]>) => {
      state.entities = action.payload;
      state.dataLoaded = true;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    authRequestSuccess: (state, action: PayloadAction<{ userId: string }>) => {
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    userCreated: (state, action: PayloadAction<UserType>) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
    userLoggedOut: (state) => {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = null;
      state.dataLoaded = false;
    },
    userUpdateSuccess: (state, action: PayloadAction<UserType>) => {
      if (state.entities) {
        const index = state.entities.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      }
    },
    authRequested: (state) => {
      state.error = null;
    },
  },
});

const { reducer: usersReducer, actions } = usersSlice;
export const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  authRequestSuccess,
  authRequestFailed,
  userCreated,
  userLoggedOut,
  userUpdateSuccess,
  authRequested,
} = actions;

function createUser(payload: UserType) {
  return async function (dispatch: AppDispatch) {
    try {
      const { content } = await userService.create(payload);
      dispatch(userCreated(content));
      return content;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export const login =
  (credentials: Credentials) => async (dispatch: AppDispatch) => {
    const { email, password, stayOn = false } = credentials;
    dispatch(authRequested());
    try {
      const data = await authService.login({ email, password });
      localStorageService.setTokens({
        refreshToken: data.refreshToken,
        idToken: data.idToken,
        localId: data.localId,
        expiresIn: data.expiresIn,
        stayOn,
      });
      dispatch(authRequestSuccess({ userId: data.localId }));
      return data;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch(authRequestFailed(errorMessage));
      throw error;
    }
  };

export const signUp =
  ({ email, password, qualities, ...rest }: SignUpData) =>
  async (dispatch: AppDispatch) => {
    dispatch(authRequested());
    try {
      const data = await authService.register({ email, password });

      localStorageService.setTokens({
        refreshToken: data.refreshToken,
        idToken: data.idToken,
        localId: data.localId,
        expiresIn: data.expiresIn,
        stayOn: true,
      });

      await dispatch(
        createUser({
          _id: data.localId,
          email,
          rate: getRandomInt(1, 5),
          completedMeetings: getRandomInt(0, 200),
          qualities,
          ...rest,
        }),
      );

      dispatch(authRequestSuccess({ userId: data.localId }));
      return data;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch(authRequestFailed(errorMessage));
      throw error;
    }
  };

export const updateUser =
  (payload: UserType) => async (dispatch: AppDispatch) => {
    try {
      const { content } = await userService.update(payload);
      dispatch(userUpdateSuccess(content));
      return content;
    } catch (error: unknown) {
      throw error;
    }
  };

export const logOut = () => (dispatch: AppDispatch) => {
  localStorageService.removeAuthData();
  dispatch(userLoggedOut());
};

export const loadUsersList = () => async (dispatch: AppDispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.get();
    dispatch(usersReceived(content));
  } catch (error: unknown) {
    dispatch(usersRequestFailed(getErrorMessage(error)));
  }
};

export const getUsersList = () => (state: RootState) => state.users.entities;

export const getCurrentUserData = () => (state: RootState) => {
  return state.users.entities
    ? state.users.entities.find((u) => u._id === state.users.auth?.userId) ||
        null
    : null;
};

export const getUserById = (userId: string) => (state: RootState) => {
  if (state.users.entities) {
    return state.users.entities.find((u) => u._id === userId);
  }
  return undefined;
};

export const getIsLoggedIn = () => (state: RootState) => state.users.isLoggedIn;
export const getDataStatus = () => (state: RootState) => state.users.dataLoaded;
export const getUsersLoadingStatus = () => (state: RootState) =>
  state.users.isLoading;
export const getCurrentUserId = () => (state: RootState) =>
  state.users.auth?.userId;
export const getAuthErrors = () => (state: RootState) => state.users.error;

export default usersReducer;
