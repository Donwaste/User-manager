import { orderBy } from "lodash";
import CommentsList, { AddCommentForm } from "../common/comments";
import { CommentType } from "../../types";
import { useComments } from "../../hooks/useComments";

const Comments = () => {
  const { createComment, comments, removeComment } = useComments();

  const handleSubmit = (data: { content: string }) => {
    createComment(data);
  };

  const handleRemoveComment = (id: string) => {
    removeComment(id);
  };

  const sortedComments = orderBy(comments, ["created_at"], ["desc"]);
  return (
    <>
      <div className="card mb-2">
        {" "}
        <div className="card-body ">
          <AddCommentForm onSubmit={handleSubmit} />
        </div>
      </div>
      {sortedComments.length > 0 && (
        <div className="card mb-3">
          <div className="card-body ">
            <h2>Comments</h2>
            <hr />
            <CommentsList
              comments={sortedComments}
              onRemove={handleRemoveComment}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
