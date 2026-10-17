export interface CommentType {
  _id: string;
  userId: string | undefined;
  pageId: string;
  content: string;
  created_at: string;
}
