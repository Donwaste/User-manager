import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";
import isOutdated from "../utils/isOutdated";
import { ProfessionType } from "../types";
import type { RootState, AppDispatch } from "./store";
import { getErrorMessage } from "../utils/getErrorMessage";

interface ProfessionsState {
  entities: ProfessionType[] | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: ProfessionsState = {
  entities: null,
  isLoading: true,
  error: null,
  lastFetch: null,
};

const professionsSlice = createSlice({
  name: "professions",
  initialState,
  reducers: {
    professionsRequested: (state) => {
      state.isLoading = true;
    },
    professionsReceived: (state, action: PayloadAction<ProfessionType[]>) => {
      state.entities = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
    },
    professionsRequestFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequested, professionsReceived, professionsRequestFailed } =
  actions;

export const loadProfessionsList =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { lastFetch } = getState().professions;

    if (isOutdated(lastFetch)) {
      dispatch(professionsRequested());
      try {
        const { content } = await professionService.get();
        dispatch(professionsReceived(content));
      } catch (error: unknown) {
        dispatch(professionsRequestFailed(getErrorMessage(error)));
      }
    }
  };

export const getProfessions = () => (state: RootState) =>
  state.professions.entities;
export const getProfessionsLoadingStatus = () => (state: RootState) =>
  state.professions.isLoading;
export const getProfessionById = (id: string) => (state: RootState) => {
  if (!state.professions.entities) return undefined;
  return state.professions.entities.find((p) => p._id === id);
};

export default professionsReducer;
