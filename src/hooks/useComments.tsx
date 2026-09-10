import { createContext, useContext, useState, useEffect } from "react";
import { CommentType, ProviderProps } from "../types";
import { useParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/getErrorMessage";

interface CommentsContextType {
  comments: CommentType[] | null;
  createComment: (data: { content: string }) => Promise<void>;
  isLoading: boolean;
  getComments: () => Promise<void>;
  removeComment: (id: string) => Promise<void>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined,
);

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
};

export const CommentsProvider = ({ children }: ProviderProps) => {
  const [comments, setComments] = useState<CommentType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    if (error !== null) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const errorCatcher = (error: unknown) => {
    setError(getErrorMessage(error));
    setIsLoading(false);
  };

  async function createComment(data: { content: string }) {
    const comment: CommentType = {
      ...data,
      _id: nanoid(),
      pageId: userId!,
      created_at: String(Date.now()),
      userId: currentUser!._id,
    };

    try {
      const newComment = await commentService.createComment(comment);
      setComments((prev) => (prev ? [...prev, newComment] : [newComment]));
    } catch (error) {
      errorCatcher(error);
    }
  }

  async function getComments() {
    try {
      const data = await commentService.getComments(userId!);
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray as CommentType[]);
    } catch (error) {
      errorCatcher(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeComment(id: string) {
    try {
      await commentService.removeComment(id);
      setComments((prev) => (prev ? prev.filter((c) => c._id !== id) : []));
    } catch (error) {
      errorCatcher(error);
    }
  }

  return (
    <CommentsContext.Provider
      value={{ comments, createComment, isLoading, getComments, removeComment }}
    >
      {!isLoading ? children : "Loading..."}
    </CommentsContext.Provider>
  );
};
