import { CommentType } from "../../types";

const comments: CommentType[] = [
  {
    _id: "67rdca3eeb7f6fg",
    userId: "67rdca3eeb7f6fgeed471815",
    pageId: "67rdca3eeb7f6fgeed471815",
    content: "Lorem ipsum dolor",
    created_at: "1633576399367",
  },
  {
    _id: "67rdca3eeb7f6fgdasd",
    pageId: "67rdca3eeb7f6fgeed471815",
    userId: "67rdca3eeb7f6fgeed471815",
    content: "Lorem ipsum dolor and etc",
    created_at: "1633573058520",
  },
  {
    _id: "67rdca3eeb7f6fgdaasd",
    pageId: "67rdca3eeb7f6fgeed471817",
    userId: "67rdca3eeb7f6fgeed471815",
    content: "Lorem ipsum dolor and etc",
    created_at: "1633573058520",
  },
];

if (!localStorage.getItem("comments")) {
  localStorage.setItem("comments", JSON.stringify(comments));
}

const getComments = (): CommentType[] => {
  const raw = localStorage.getItem("comments");
  return raw ? JSON.parse(raw) : [];
};

const fetchAll = (): Promise<CommentType[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(getComments());
    }, 200);
  });

const fetchCommentsForUser = (userId: string): Promise<CommentType[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(getComments().filter((c) => c.pageId === userId));
    }, 200);
  });

const add = (
  data: Omit<CommentType, "_id" | "created_at">,
): Promise<CommentType> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const comments = getComments();
      const newComment: CommentType = {
        ...data,
        created_at: Date.now().toString(),
        _id: Math.random().toString(36).substr(2, 9),
      };
      comments.push(newComment);
      localStorage.setItem("comments", JSON.stringify(comments));
      resolve(newComment);
    }, 200);
  });

const remove = (id: string): Promise<string> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const comments = getComments();
      const newComments = comments.filter((x) => x._id !== id);
      localStorage.setItem("comments", JSON.stringify(newComments));
      resolve(id);
    }, 200);
  });

export default {
  fetchAll,
  fetchCommentsForUser,
  add,
  remove,
};
