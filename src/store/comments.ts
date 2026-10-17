import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import { nanoid } from "nanoid";
import { getCurrentUserId } from "./users";
import { getErrorMessage } from "../utils/getErrorMessage";
import { CommentType } from "../types";
import type { RootState, AppDispatch } from "./store";

interface CommentsState {
  entities: CommentType[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  entities: null,
  isLoading: true,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    commentsRequested: (state) => {
      state.isLoading = true;
    },
    commentsReceived: (state, action: PayloadAction<CommentType[]>) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    commentsRequestFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    commentCreated: (state, action: PayloadAction<CommentType>) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
    commentRemoved: (state, action: PayloadAction<string>) => {
      if (state.entities) {
        state.entities = state.entities.filter((c) => c._id !== action.payload);
      }
    },
  },
});

const { reducer: commentsReducer, actions } = commentsSlice;
export const {
  commentsRequested,
  commentsReceived,
  commentsRequestFailed,
  commentCreated,
  commentRemoved,
} = actions;

export const loadCommentsList =
  (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(commentsRequested());
    try {
      const data = await commentService.getComments(userId);
      const commentsArray: CommentType[] = data
        ? Array.isArray(data)
          ? data
          : Object.values(data)
        : [];
      dispatch(commentsReceived(commentsArray));
    } catch (error: unknown) {
      dispatch(commentsRequestFailed(getErrorMessage(error)));
    }
  };

interface CreateCommentPayload {
  content: string;
  pageId: string;
}

export const createComment =
  (payload: CreateCommentPayload) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentUserId = getCurrentUserId()(getState());

      const comment: CommentType = {
        ...payload,
        _id: nanoid(),
        created_at: String(Date.now()),
        userId: currentUserId!,
      };

      const data = await commentService.createComment(comment);
      dispatch(commentCreated(data || comment));
    } catch (error: unknown) {
      dispatch(commentsRequestFailed(getErrorMessage(error)));
      throw error;
    }
  };
export const removeComment =
  (commentId: string) => async (dispatch: AppDispatch) => {
    try {
      await commentService.removeComment(commentId);
      dispatch(commentRemoved(commentId));
    } catch (error: unknown) {
      dispatch(commentsRequestFailed(getErrorMessage(error)));
    }
  };
export const getComments = () => (state: RootState) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state: RootState) =>
  state.comments.isLoading;

export default commentsReducer;
