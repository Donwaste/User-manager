import Comment from "./comment";

const CommentsList = ({ comments = [], onRemove }) => {
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
