import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import qualityService from "../services/quality.service";
import { QualityType } from "../types";
import type { RootState, AppDispatch } from "./store";
import isOutdated from "../utils/isOutdated";
import { getErrorMessage } from "../utils/getErrorMessage";

interface QualitiesState {
  entities: QualityType[] | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: QualitiesState = {
  entities: null,
  isLoading: true,
  error: null,
  lastFetch: null,
};

const qualitiesSlice = createSlice({
  name: "qualities",
  initialState,
  reducers: {
    qualitiesRequested: (state) => {
      state.isLoading = true;
    },
    qualitiesReceived: (state, action: PayloadAction<QualityType[]>) => {
      state.entities = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
    },
    qualitiesRequestFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { reducer: qualitiesReducer, actions } = qualitiesSlice;
const { qualitiesRequested, qualitiesReceived, qualitiesRequestFailed } =
  actions;

export const loadQualitiesList =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { lastFetch } = getState().qualities;

    if (isOutdated(lastFetch)) {
      dispatch(qualitiesRequested());
      try {
        const { content } = await qualityService.get();
        dispatch(qualitiesReceived(content));
      } catch (error: unknown) {
        dispatch(qualitiesRequestFailed(getErrorMessage(error)));
      }
    }
  };

export const getQualities = () => (state: RootState) =>
  state.qualities.entities;
export const getQualitiesStatus = () => (state: RootState) =>
  state.qualities.isLoading;
export const getQualityById = (id: string) => (state: RootState) => {
  if (!state.qualities.entities) return undefined;
  return state.qualities.entities.find((q) => q._id === id);
};

export default qualitiesReducer;
