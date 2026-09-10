import { CommentType } from "../types";
import httpService from "./http.service";

const commentEndpoint = "comments/";

const commentService = {
  createComment: async (payload: CommentType): Promise<CommentType> => {
    const { data } = await httpService.put(
      commentEndpoint + payload._id,
      payload,
    );
    return data.content;
  },
  getComments: async (pageId: string) => {
    const { data } = await httpService.get(commentEndpoint, {
      params: { orderBy: '"pageId"', equalTo: `"${pageId}"` },
    });
    return data.content;
  },
  removeComment: async (commentId: string) => {
    const { data } = await httpService.delete(commentEndpoint + commentId);
    return data;
  },
};

export default commentService;
