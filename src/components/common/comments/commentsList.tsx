import { CommentType } from "../../../types";
import Comment from "./comment";

interface CommentsListProps {
  comments: CommentType[];
  onRemove: (id: string) => void;
}

const CommentsList = ({ comments, onRemove }: CommentsListProps) => {
  if (!comments.length) {
    return <p>Loading...</p>;
  }

  return (
    <ul className="comments-list">
      {comments.map((comment) => (
        <Comment key={comment._id} {...comment} onRemove={onRemove} />
      ))}
    </ul>
  );
};

export default CommentsList;
